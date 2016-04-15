/**
 * Created by qulongjun on 16/4/13.
 */
var JT = window.JT || {};
var JTABLE_CONFIG = Window.JTABLE_CONFIG || {};
Window.JT = JT;
JT.instants = {};
JT.commands = {};
JT.dom={};
window.JTABLE_CONFIG = {
    container: ""//必需
    , tdWidth: "50"
    , tdHeight: "50"
    , tdvalign: "center"
    , defaultRows: 5
    , defaultCols: 5
    , tableWidth: 300
    ,tableStyle:'table{margin-bottom:10px;border-collapse:collapse;display:table;}' +
    'td,th{padding: 5px 10px;border: 1px solid #DDD;}' +
    'caption{border:1px dashed #DDD;border-bottom:0;padding:3px;text-align:center;}' +
    'th{border-top:1px solid #BBB;background-color:#F7F7F7;}' +
    'table tr.firstRow th{border-top-width:2px;}' +
    '.ue-table-interlace-color-single{ background-color: #fcfcfc; } .ue-table-interlace-color-double{ background-color: #f7faff; }' +
    'td p{margin:0;padding:0;}'
    ,selectTableStyle:'.selectTdClass{background-color:#edf5fa !important}' +
    'table.noBorderTable td,table.noBorderTable th,table.noBorderTable caption{border:1px dashed #ddd !important}'

};
var uid = 0;

var JEventBase=JT.JEventBase={

};
JEventBase.prototype={
    /**
     * 注册事件监听器
     * @method addListener
     * @param { String } types 监听的事件名称，同时监听多个事件使用空格分隔
     * @param { Function } fn 监听的事件被触发时，会执行该回调函数
     * @waining 事件被触发时，监听的函数假如返回的值恒等于true，回调函数的队列中后面的函数将不执行
     * @example
     * ```javascript
     * editor.addListener('selectionchange',function(){
     *      console.log("选区已经变化！");
     * })
     * editor.addListener('beforegetcontent aftergetcontent',function(type){
     *         if(type == 'beforegetcontent'){
     *             //do something
     *         }else{
     *             //do something
     *         }
     *         console.log(this.getContent) // this是注册的事件的编辑器实例
     * })
     * ```
     * @see UE.EventBase:fireEvent(String)
     */
    addListener:function (types, listener) {
        types = JUtils.trim(types).split(/\s+/);
        for (var i = 0, ti; ti = types[i++];) {
            getListener(this, ti, true).push(listener);
        }
    },

    on : function(types, listener){
        return this.addListener(types,listener);
    },
    off : function(types, listener){
        return this.removeListener(types, listener)
    },
    trigger:function(){
        return this.fireEvent.apply(this,arguments);
    },
    /**
     * 移除事件监听器
     * @method removeListener
     * @param { String } types 移除的事件名称，同时移除多个事件使用空格分隔
     * @param { Function } fn 移除监听事件的函数引用
     * @example
     * ```javascript
     * //changeCallback为方法体
     * editor.removeListener("selectionchange",changeCallback);
     * ```
     */
    removeListener:function (types, listener) {
        types = JUtils.trim(types).split(/\s+/);
        for (var i = 0, ti; ti = types[i++];) {
            JUtils.removeItem(getListener(this, ti) || [], listener);
        }
    },

    /**
     * 触发事件
     * @method fireEvent
     * @param { String } types 触发的事件名称，同时触发多个事件使用空格分隔
     * @remind 该方法会触发addListener
     * @return { * } 返回触发事件的队列中，最后执行的回调函数的返回值
     * @example
     * ```javascript
     * editor.fireEvent("selectionchange");
     * ```
     */

    /**
     * 触发事件
     * @method fireEvent
     * @param { String } types 触发的事件名称，同时触发多个事件使用空格分隔
     * @param { *... } options 可选参数，可以传入一个或多个参数，会传给事件触发的回调函数
     * @return { * } 返回触发事件的队列中，最后执行的回调函数的返回值
     * @example
     * ```javascript
     *
     * editor.addListener( "selectionchange", function ( type, arg1, arg2 ) {
     *
     *     console.log( arg1 + " " + arg2 );
     *
     * } );
     *
     * //触发selectionchange事件， 会执行上面的事件监听器
     * //output: Hello World
     * editor.fireEvent("selectionchange", "Hello", "World");
     * ```
     */
    fireEvent:function () {
        var types = arguments[0];
        types = JUtils.trim(types).split(' ');
        for (var i = 0, ti; ti = types[i++];) {
            var listeners = getListener(this, ti),
                r, t, k;
            if (listeners) {
                k = listeners.length;
                while (k--) {
                    if(!listeners[k])continue;
                    t = listeners[k].apply(this, arguments);
                    if(t === true){
                        return t;
                    }
                    if (t !== undefined) {
                        r = t;
                    }
                }
            }
            if (t = this['on' + ti.toLowerCase()]) {
                r = t.apply(this, arguments);
            }
        }
        return r;
    }
};
/**
 * 获得对象所拥有监听类型的所有监听器
 * @unfile
 * @module UE
 * @since 1.2.6.1
 * @method getListener
 * @public
 * @param { Object } obj  查询监听器的对象
 * @param { String } type 事件类型
 * @param { Boolean } force  为true且当前所有type类型的侦听器不存在时，创建一个空监听器数组
 * @return { Array } 监听器数组
 */
function getListener(obj, type, force) {
    var allListeners;
    type = type.toLowerCase();
    return ( ( allListeners = ( obj.__allListeners || force && ( obj.__allListeners = {} ) ) )
    && ( allListeners[type] || force && ( allListeners[type] = [] ) ) );
}

var JEvent=JT.JEvent={
    init:function () {
        var me =this;
        //click();
        JEvent.click.call(me);
    },
    click:function () {
        var me=this;
        $(me.container).on('mousedown',function () {
            console.log('down');
        });
        $(me.container).on('mouseup',function () {
            console.log('up');
        });

    }
};

var JTable = JT.JTable = function (options) {
    var me = this;
    me.uid = uid++;
    me.options = JUtils.extend(JUtils.clone(options || {}), JTABLE_CONFIG, true);
    me.container = document.getElementById(options.container);
    me.document=document;
    me.outputRules=[];
    me.selection = new JT.dom.Selection(document);
    me.window=JUtils.getWindow(me.container);
    JCommand.load(me);
    JT.instants['tableInstant' + me.uid] = me;
    JEvent.init.call(me);
    //me.document;=this.document;
    //me.container=document.getElementById(container);
    JTableAction.call(me);

};
JTable.prototype = {
    /**
     * 执行编辑命令cmdName，完成表格编辑效果
     * @method execCommand
     * @param { String } cmdName 需要执行的命令
     * @remind 具体命令的使用请参考<a href="#COMMAND.LIST">命令列表</a>
     * @return { * } 返回命令函数运行的返回值
     * @example
     * ```javascript
     * editor.execCommand(cmdName);
     * ```
     */
    execCommand: function (cmdName) {
        cmdName = cmdName.toLowerCase();
        var me = this,
            result,
            cmd = JT.commands[cmdName];
        if (!cmd || !cmd.execCommand) {
            return null;
        }
        result = this._callCmdFn('execCommand', arguments);
        return result;
    },
    /**
     * 执行编辑命令
     * @method _callCmdFn
     * @private
     * @param { String } fnName 函数名称
     * @param { * } args 传给命令函数的参数
     * @return { * } 返回命令函数运行的返回值
     */
    _callCmdFn: function (fnName, args) {
        var cmdName = args[0].toLowerCase(),
            cmd, cmdFn;
        cmd = JT.commands[cmdName];
        cmdFn = cmd && cmd[fnName];
        //没有querycommandstate或者没有command的都默认返回0
        if ((!cmd || !cmdFn) && fnName == 'queryCommandState') {
            return 0;
        } else if (cmdFn) {
            return cmdFn.apply(this, args);
        }
    },
    /**
     * 注册输出过滤规则
     * @method  addOutputRule
     * @param { Function } rule 要添加的过滤规则
     * @example
     * ```javascript
     * editor.addOutputRule(function(root){
         *   $.each(root.getNodesByTagName('p'),function(i,node){
         *       node.tagName="div";
         *   });
         * });
     * ```
     */
    addOutputRule: function (rule) {
        this.outputRules.push(rule)
    },
    /**
     * 该方法是提供给插件里面使用，设置配置项默认值
     * @method setOpt
     * @warning 三处设置配置项的优先级: 实例化时传入参数 > setOpt()设置 > config文件里设置
     * @warning 该方法仅供编辑器插件内部和编辑器初始化时调用，其他地方不能调用。
     * @param { String } key 编辑器的可接受的选项名称
     * @param { * } val  该选项可接受的值
     * @example
     * ```javascript
     * editor.setOpt( 'initContent', '欢迎使用编辑器' );
     * ```
     */

    /**
     * 该方法是提供给插件里面使用，以{key:value}集合的方式设置插件内用到的配置项默认值
     * @method setOpt
     * @warning 三处设置配置项的优先级: 实例化时传入参数 > setOpt()设置 > config文件里设置
     * @warning 该方法仅供编辑器插件内部和编辑器初始化时调用，其他地方不能调用。
     * @param { Object } options 将要设置的选项的键值对对象
     * @example
     * ```javascript
     * editor.setOpt( {
         *     'initContent': '欢迎使用编辑器'
         * } );
     * ```
     */
    setOpt: function (key, val) {
        var obj = {};
        if (JUtils.isString(key)) {
            obj[key] = val
        } else {
            obj = key;
        }
        JUtils.extend(this.options, obj, true);
    },
    getOpt:function(key){
        return this.options[key]
    },
    /**
     * 编辑器对外提供的监听ready事件的接口， 通过调用该方法，达到的效果与监听ready事件是一致的
     * @method ready
     * @param { Function } fn 编辑器ready之后所执行的回调, 如果在注册事件之前编辑器已经ready，将会
     * 立即触发该回调。
     * @remind 需要等待编辑器加载完成后才能执行的代码,可以使用该方法传入
     * @example
     * ```javascript
     * editor.ready( function( editor ) {
         *     editor.setContent('初始化完毕');
         * } );
     * ```
     * @see UE.Editor.event:ready
     */
    ready: function (fn) {
        var me = this;
        if (fn) {
            me.isReady ? fn.apply(me) : me.addListener('ready', fn);
        }
    },
};

var JTableAction=function () {
    var me = this,
        tabTimer = null,
    //拖动计时器
        tableDragTimer = null,
    //双击计时器
        tableResizeTimer = null,
    //单元格最小宽度
        cellMinWidth = 5,
        isInResizeBuffer = false,
    //单元格边框大小
        cellBorderWidth = 5,
    //鼠标偏移距离
        offsetOfTableCell = 10,
    //记录在有限时间内的点击状态， 共有3个取值， 0, 1, 2。 0代表未初始化， 1代表单击了1次，2代表2次
        singleClickState = 0,
        userActionStatus = null,
    //双击允许的时间范围
        dblclickTime = 360,
        UT = JT.JTable,
        getDefaultValue = function (editor, table) {
            return JCommand.getDefaultValue(editor, table);
        },
        removeSelectedClass = function (cells) {
            return UT.removeSelectedClass(cells);
        };

    /**
     * 根据当前点击的td或者table获取索引对象
     * @param tdOrTable
     */
    getJTable = function (tdOrTable) {
        var tag = tdOrTable.tagName.toLowerCase();
        tdOrTable = (tag == "td" || tag == "th" || tag == 'caption') ? JUtils.findParentByTagName(tdOrTable, "table", true) : tdOrTable;
        if (!tdOrTable.ueTable) {
            tdOrTable.ueTable = new JTable(tdOrTable);
        }
        return tdOrTable.ueTable;
    };
    getJTableBySelected = function (editor) {
        var table = getTableItemsByRange(editor).table;
        if (table && table.JTable && table.JTable.selectedTds.length) {
            return table.JTable;
        }
        return null;
    };
    removeSelectedClass = function (cells) {
        JUtils.each(cells, function (cell) {
            JUtils.removeClasses(cell, "selectTdClass");
        })
    };
    /**
     * 根据当前选区获取相关的table信息
     * @return {Object}
     */
    getTableItemsByRange = function (editor) {
        var start = editor.selection.getStart();

        //ff下会选中bookmark
        if( start && start.id && start.id.indexOf('_baidu_bookmark_start_') === 0 && start.nextSibling) {
            start = start.nextSibling;
        }

        //在table或者td边缘有可能存在选中tr的情况
        var cell = start && JUtils.findParentByTagName(start, ["td", "th"], true),
            tr = cell && cell.parentNode,
            caption = start && JUtils.findParentByTagName(start, 'caption', true),
            table = caption ? caption.parentNode : tr && tr.parentNode.parentNode;

        return {
            cell:cell,
            tr:tr,
            table:table,
            caption:caption
        }
    };

    function showError(e) {
//        throw e;
    }
    //处理拖动及框选相关方法
    var startTd = null, //鼠标按下时的锚点td
        currentTd = null, //当前鼠标经过时的td
        onDrag = "", //指示当前拖动状态，其值可为"","h","v" ,分别表示未拖动状态，横向拖动状态，纵向拖动状态，用于鼠标移动过程中的判断
        onBorder = false, //检测鼠标按下时是否处在单元格边缘位置
        dragButton = null,
        dragOver = false,
        dragLine = null, //模拟的拖动线
        dragTd = null;    //发生拖动的目标td

    var mousedown = false,
    //todo 判断混乱模式
        needIEHack = true;

    me.setOpt({
        'maxColNum':20,
        'maxRowNum':100,
        'defaultCols':5,
        'defaultRows':5,
        'tdvalign':'top',
        'cursorpath':me.options.UEDITOR_HOME_URL + "themes/default/images/cursor_",
        'tableDragable':true,
        'classList':["ue-table-interlace-color-single","ue-table-interlace-color-double"],
        'tableWidth':700
    });
    me.getJTable = getJTable;
    var commands = {
        'deletetable':1,
        'inserttable':1,
        'cellvalign':1,
        'insertcaption':1,
        'deletecaption':1,
        'inserttitle':1,
        'deletetitle':1,
        "mergeright":1,
        "mergedown":1,
        "mergecells":1,
        "insertrow":1,
        "insertrownext":1,
        "deleterow":1,
        "insertcol":1,
        "insertcolnext":1,
        "deletecol":1,
        "splittocells":1,
        "splittorows":1,
        "splittocols":1,
        "adaptbytext":1,
        "adaptbywindow":1,
        "adaptbycustomer":1,
        "insertparagraph":1,
        "insertparagraphbeforetable":1,
        "averagedistributecol":1,
        "averagedistributerow":1
    };
    me.ready(function () {
        // JUtils.cssRule('table',
        //     //选中的td上的样式
        //     '.selectTdClass{background-color:#edf5fa !important}' +
        //     'table.noBorderTable td,table.noBorderTable th,table.noBorderTable caption{border:1px dashed #ddd !important}' +
        //     //插入的表格的默认样式
        //     'table{margin-bottom:10px;border-collapse:collapse;display:table;}' +
        //     'td,th{padding: 5px 10px;border: 1px solid #DDD;}' +
        //     'caption{border:1px dashed #DDD;border-bottom:0;padding:3px;text-align:center;}' +
        //     'th{border-top:1px solid #BBB;background-color:#F7F7F7;}' +
        //     'table tr.firstRow th{border-top-width:2px;}' +
        //     '.ue-table-interlace-color-single{ background-color: #fcfcfc; } .ue-table-interlace-color-double{ background-color: #f7faff; }' +
        //     'td p{margin:0;padding:0;}', me.document);
        // var tableCopyList, isFullCol, isFullRow;
        me.on('click',function () {
            alert('aaa');
        });
        //注册del/backspace事件
        me.addListener('keydown', function (cmd, evt) {
            var me = this;
            var keyCode = evt.keyCode || evt.which;

            if (keyCode == 8) {

                var ut = getUETableBySelected(me);
                if (ut && ut.selectedTds.length) {

                    if (ut.isFullCol()) {
                        me.execCommand('deletecol')
                    } else if (ut.isFullRow()) {
                        me.execCommand('deleterow')
                    } else {
                        me.fireEvent('delcells');
                    }
                    JUtils.preventDefault(evt);
                }

                var caption = JUtils.findParentByTagName(me.selection.getStart(), 'caption', true),
                    range = me.selection.getRange();
                if (range.collapsed && caption && isEmptyBlock(caption)) {
                    me.fireEvent('saveScene');
                    var table = caption.parentNode;
                    JUtils.remove(caption);
                    if (table) {
                        range.setStart(table.rows[0].cells[0], 0).setCursor(false, true);
                    }
                    me.fireEvent('saveScene');
                }

            }

            if (keyCode == 46) {

                ut = getUETableBySelected(me);
                if (ut) {
                    me.fireEvent('saveScene');
                    for (var i = 0, ci; ci = ut.selectedTds[i++];) {
                        JUtils.fillNode(me.document, ci)
                    }
                    me.fireEvent('saveScene');
                    JUtils.preventDefault(evt);

                }

            }
            if (keyCode == 13) {

                var rng = me.selection.getRange(),
                    caption = JUtils.findParentByTagName(rng.startContainer, 'caption', true);
                if (caption) {
                    var table = JUtils.findParentByTagName(caption, 'table');
                    if (!rng.collapsed) {

                        rng.deleteContents();
                        me.fireEvent('saveScene');
                    } else {
                        if (caption) {
                            rng.setStart(table.rows[0].cells[0], 0).setCursor(false, true);
                        }
                    }
                    JUtils.preventDefault(evt);
                    return;
                }
                if (rng.collapsed) {
                    var table = JUtils.findParentByTagName(rng.startContainer, 'table');
                    if (table) {
                        var cell = table.rows[0].cells[0],
                            start = JUtils.findParentByTagName(me.selection.getStart(), ['td', 'th'], true),
                            preNode = table.previousSibling;
                        if (cell === start && (!preNode || preNode.nodeType == 1 && preNode.tagName == 'TABLE' ) && JUtils.isStartInblock(rng)) {
                            var first = JUtils.findParent(me.selection.getStart(), function(n){return JUtils.isBlockElm(n)}, true);
                            if(first && ( /t(h|d)/i.test(first.tagName) || first ===  start.firstChild )){
                                me.execCommand('insertparagraphbeforetable');
                                JUtils.preventDefault(evt);
                            }

                        }
                    }
                }
            }

            if ((evt.ctrlKey || evt.metaKey) && evt.keyCode == '67') {
                tableCopyList = null;
                var ut = getUETableBySelected(me);
                if (ut) {
                    var tds = ut.selectedTds;
                    isFullCol = ut.isFullCol();
                    isFullRow = ut.isFullRow();
                    tableCopyList = [
                        [ut.cloneCell(tds[0],null,true)]
                    ];
                    for (var i = 1, ci; ci = tds[i]; i++) {
                        if (ci.parentNode !== tds[i - 1].parentNode) {
                            tableCopyList.push([ut.cloneCell(ci,null,true)]);
                        } else {
                            tableCopyList[tableCopyList.length - 1].push(ut.cloneCell(ci,null,true));
                        }

                    }
                }
            }
        });
        me.addListener("tablehasdeleted",function(){
            toggleDraggableState(this, false, "", null);
            if (dragButton)JUtils.remove(dragButton);
        });

        me.addListener('beforepaste', function (cmd, html) {
            var me = this;
            var rng = me.selection.getRange();
            if (JUtils.findParentByTagName(rng.startContainer, 'caption', true)) {
                var div = me.document.createElement("div");
                div.innerHTML = html.html;
                //trace:3729
                html.html = div[browser.ie9below ? 'innerText' : 'textContent'];
                return;
            }
            var table = getUETableBySelected(me);
            if (tableCopyList) {
                me.fireEvent('saveScene');
                var rng = me.selection.getRange();
                var td = JUtils.findParentByTagName(rng.startContainer, ['td', 'th'], true), tmpNode, preNode;
                if (td) {
                    var ut = getUETable(td);
                    if (isFullRow) {
                        var rowIndex = ut.getCellInfo(td).rowIndex;
                        if (td.tagName == 'TH') {
                            rowIndex++;
                        }
                        for (var i = 0, ci; ci = tableCopyList[i++];) {
                            var tr = ut.insertRow(rowIndex++, "td");
                            for (var j = 0, cj; cj = ci[j]; j++) {
                                var cell = tr.cells[j];
                                if (!cell) {
                                    cell = tr.insertCell(j)
                                }
                                cell.innerHTML = cj.innerHTML;
                                cj.getAttribute('width') && cell.setAttribute('width', cj.getAttribute('width'));
                                cj.getAttribute('vAlign') && cell.setAttribute('vAlign', cj.getAttribute('vAlign'));
                                cj.getAttribute('align') && cell.setAttribute('align', cj.getAttribute('align'));
                                cj.style.cssText && (cell.style.cssText = cj.style.cssText)
                            }
                            for (var j = 0, cj; cj = tr.cells[j]; j++) {
                                if (!ci[j])
                                    break;
                                cj.innerHTML = ci[j].innerHTML;
                                ci[j].getAttribute('width') && cj.setAttribute('width', ci[j].getAttribute('width'));
                                ci[j].getAttribute('vAlign') && cj.setAttribute('vAlign', ci[j].getAttribute('vAlign'));
                                ci[j].getAttribute('align') && cj.setAttribute('align', ci[j].getAttribute('align'));
                                ci[j].style.cssText && (cj.style.cssText = ci[j].style.cssText)
                            }
                        }
                    } else {
                        if (isFullCol) {
                            cellInfo = ut.getCellInfo(td);
                            var maxColNum = 0;
                            for (var j = 0, ci = tableCopyList[0], cj; cj = ci[j++];) {
                                maxColNum += cj.colSpan || 1;
                            }
                            me.__hasEnterExecCommand = true;
                            for (i = 0; i < maxColNum; i++) {
                                me.execCommand('insertcol');
                            }
                            me.__hasEnterExecCommand = false;
                            td = ut.table.rows[0].cells[cellInfo.cellIndex];
                            if (td.tagName == 'TH') {
                                td = ut.table.rows[1].cells[cellInfo.cellIndex];
                            }
                        }
                        for (var i = 0, ci; ci = tableCopyList[i++];) {
                            tmpNode = td;
                            for (var j = 0, cj; cj = ci[j++];) {
                                if (td) {
                                    td.innerHTML = cj.innerHTML;
                                    //todo 定制处理
                                    cj.getAttribute('width') && td.setAttribute('width', cj.getAttribute('width'));
                                    cj.getAttribute('vAlign') && td.setAttribute('vAlign', cj.getAttribute('vAlign'));
                                    cj.getAttribute('align') && td.setAttribute('align', cj.getAttribute('align'));
                                    cj.style.cssText && (td.style.cssText = cj.style.cssText);
                                    preNode = td;
                                    td = td.nextSibling;
                                } else {
                                    var cloneTd = cj.cloneNode(true);
                                    JUtils.removeAttributes(cloneTd, ['class', 'rowSpan', 'colSpan']);

                                    preNode.parentNode.appendChild(cloneTd)
                                }
                            }
                            td = ut.getNextCell(tmpNode, true, true);
                            if (!tableCopyList[i])
                                break;
                            if (!td) {
                                var cellInfo = ut.getCellInfo(tmpNode);
                                ut.table.insertRow(ut.table.rows.length);
                                ut.update();
                                td = ut.getVSideCell(tmpNode, true);
                            }
                        }
                    }
                    ut.update();
                } else {
                    table = me.document.createElement('table');
                    for (var i = 0, ci; ci = tableCopyList[i++];) {
                        var tr = table.insertRow(table.rows.length);
                        for (var j = 0, cj; cj = ci[j++];) {
                            cloneTd = UT.cloneCell(cj,null,true);
                            JUtils.removeAttributes(cloneTd, ['class']);
                            tr.appendChild(cloneTd)
                        }
                        if (j == 2 && cloneTd.rowSpan > 1) {
                            cloneTd.rowSpan = 1;
                        }
                    }

                    var defaultValue = getDefaultValue(me),
                        width = me.offsetWidth -
                            (needIEHack ? parseInt(JUtils.getComputedStyle(me, 'margin-left'), 10) * 2 : 0) - defaultValue.tableBorder * 2 - (me.options.offsetWidth || 0);
                    me.execCommand('insertHTML', '<table  ' +
                        ( isFullCol && isFullRow ? 'width="' + width + '"' : '') +
                        '>' + table.innerHTML.replace(/>\s*</g, '><').replace(/\bth\b/gi, "td") + '</table>')
                }
                me.fireEvent('contentchange');
                me.fireEvent('saveScene');
                html.html = '';
                return true;
            } else {
                var div = me.document.createElement("div"), tables;
                div.innerHTML = html.html;
                tables = div.getElementsByTagName("table");
                if (JUtils.findParentByTagName(me.selection.getStart(), 'table')) {
                    JUtils.each(tables, function (t) {
                        JUtils.remove(t)
                    });
                    if (JUtils.findParentByTagName(me.selection.getStart(), 'caption', true)) {
                        div.innerHTML = div[browser.ie ? 'innerText' : 'textContent'];
                    }
                } else {
                    JUtils.each(tables, function (table) {
                        removeStyleSize(table, true);
                        JUtils.removeAttributes(table, ['style', 'border']);
                        JUtils.each(JUtils.getElementsByTagName(table, "td"), function (td) {
                            if (isEmptyBlock(td)) {
                                JUtils.fillNode(me.document, td);
                            }
                            removeStyleSize(td, true);
//                            JUtils.removeAttributes(td, ['style'])
                        });
                    });
                }
                html.html = div.innerHTML;
            }
        });

        me.addListener('afterpaste', function () {
            JUtils.each(JUtils.getElementsByTagName(me, "table"), function (table) {
                if (table.offsetWidth > me.offsetWidth) {
                    var defaultValue = getDefaultValue(me, table);
                    table.style.width = me.offsetWidth - (needIEHack ? parseInt(JUtils.getComputedStyle(me, 'margin-left'), 10) * 2 : 0) - defaultValue.tableBorder * 2 - (me.options.offsetWidth || 0) + 'px'
                }
            })
        });
        me.addListener('blur', function () {
            tableCopyList = null;
        });
        var timer;
        me.addListener('keydown', function () {
            clearTimeout(timer);
            timer = setTimeout(function () {
                var rng = me.selection.getRange(),
                    cell = JUtils.findParentByTagName(rng.startContainer, ['th', 'td'], true);
                if (cell) {
                    var table = cell.parentNode.parentNode.parentNode;
                    if (table.offsetWidth > table.getAttribute("width")) {
                        cell.style.wordBreak = "break-all";
                    }
                }

            }, 100);
        });
        me.addListener("selectionchange", function () {
            toggleDraggableState(me, false, "", null);
        });


        //内容变化时触发索引更新
        //todo 可否考虑标记检测，如果不涉及表格的变化就不进行索引重建和更新
        me.addListener("contentchange", function () {
            var me = this;
            //尽可能排除一些不需要更新的状况
            hideDragLine(me);
            if (getJTableBySelected(me))return;
            var rng = me.selection.getRange();
            var start = rng.startContainer;
            start = JUtils.findParentByTagName(start, ['td', 'th'], true);
            JUtils.each(JUtils.getElementsByTagName(me.container, 'table'), function (table) {
                if (me.fireEvent("excludetable", table) === true) return;
                //table.ueTable = new UT(table);
                //trace:3742
//                JUtils.each(JUtils.getElementsByTagName(me.document, 'td'), function (td) {
//
//                    if (JUtils.isEmptyBlock(td) && td !== start) {
//                        JUtils.fillNode(me.document, td);
//                        if (browser.ie && browser.version == 6) {
//                            td.innerHTML = '&nbsp;'
//                        }
//                    }
//                });
//                JUtils.each(JUtils.getElementsByTagName(me.document, 'th'), function (th) {
//                    if (JUtils.isEmptyBlock(th) && th !== start) {
//                        JUtils.fillNode(me.document, th);
//                        if (browser.ie && browser.version == 6) {
//                            th.innerHTML = '&nbsp;'
//                        }
//                    }
//                });
                table.onmouseover = function () {
                    me.fireEvent('tablemouseover', table);
                };
                table.onmousemove = function () {
                    me.fireEvent('tablemousemove', table);
                    me.options.tableDragable && toggleDragButton(true, this, me);
                    JUtils.defer(function(){
                        me.fireEvent('contentchange',50)
                    },true)
                };
                table.onmouseout = function () {
                    me.fireEvent('tablemouseout', table);
                    toggleDraggableState(me, false, "", null);
                    hideDragLine(me);
                };
                table.onclick = function (evt) {
                    evt = me.window.event || evt;
                    var target = getParentTdOrTh(evt.target || evt.srcElement);
                    if (!target)return;
                    var ut = getJTable(target),
                        table = ut.table,
                        cellInfo = ut.getCellInfo(target),
                        cellsRange,
                        rng = me.selection.getRange();
//                    if ("topLeft" == inPosition(table, mouseCoords(evt))) {
//                        cellsRange = ut.getCellsRange(ut.table.rows[0].cells[0], ut.getLastCell());
//                        ut.setSelected(cellsRange);
//                        return;
//                    }
//                    if ("bottomRight" == inPosition(table, mouseCoords(evt))) {
//
//                        return;
//                    }
                    if (inTableSide(table, target, evt, true)) {
                        var endTdCol = ut.getCell(ut.indexTable[ut.rowsNum - 1][cellInfo.colIndex].rowIndex, ut.indexTable[ut.rowsNum - 1][cellInfo.colIndex].cellIndex);
                        if (evt.shiftKey && ut.selectedTds.length) {
                            if (ut.selectedTds[0] !== endTdCol) {
                                cellsRange = ut.getCellsRange(ut.selectedTds[0], endTdCol);
                                ut.setSelected(cellsRange);
                            } else {
                                rng && rng.selectNodeContents(endTdCol).select();
                            }
                        } else {
                            if (target !== endTdCol) {
                                cellsRange = ut.getCellsRange(target, endTdCol);
                                ut.setSelected(cellsRange);
                            } else {
                                rng && rng.selectNodeContents(endTdCol).select();
                            }
                        }
                        return;
                    }
                    if (inTableSide(table, target, evt)) {
                        var endTdRow = ut.getCell(ut.indexTable[cellInfo.rowIndex][ut.colsNum - 1].rowIndex, ut.indexTable[cellInfo.rowIndex][ut.colsNum - 1].cellIndex);
                        if (evt.shiftKey && ut.selectedTds.length) {
                            if (ut.selectedTds[0] !== endTdRow) {
                                cellsRange = ut.getCellsRange(ut.selectedTds[0], endTdRow);
                                ut.setSelected(cellsRange);
                            } else {
                                rng && rng.selectNodeContents(endTdRow).select();
                            }
                        } else {
                            if (target !== endTdRow) {
                                cellsRange = ut.getCellsRange(target, endTdRow);
                                ut.setSelected(cellsRange);
                            } else {
                                rng && rng.selectNodeContents(endTdRow).select();
                            }
                        }
                    }
                };
            });

            switchBorderColor(me, true);
        });

        JUtils.on(me.container, "mousemove", mouseMoveEvent);

        JUtils.on(me.container, "mouseout", function (evt) {
            var target = evt.target || evt.srcElement;
            if (target.tagName == "TABLE") {
                toggleDraggableState(me, false, "", null);
            }
        });
        /**
         * 表格隔行变色
         */
        me.addListener("interlacetable",function(type,table,classList){
            if(!table) return;
            var me = this,
                rows = table.rows,
                len = rows.length,
                getClass = function(list,index,repeat){
                    return list[index] ? list[index] : repeat ? list[index % list.length]: "";
                };
            for(var i = 0;i<len;i++){
                rows[i].className = getClass( classList|| me.options.classList,i,true);
            }
        });
        me.addListener("uninterlacetable",function(type,table){
            if(!table) return;
            var me = this,
                rows = table.rows,
                classList = me.options.classList,
                len = rows.length;
            for(var i = 0;i<len;i++){
                JUtils.removeClasses( rows[i], classList );
            }
        });

        me.addListener("mousedown", mouseDownEvent);
        me.addListener("mouseup", mouseUpEvent);
        //拖动的时候触发mouseup
        JUtils.on( me.document, 'dragstart', function( evt ){
            mouseUpEvent.call( me, 'dragstart', evt );
        });
        me.addOutputRule(function(root){
            JUtils.each(root.getNodesByTagName('div'),function(n){
                if (n.getAttr('id') == 'ue_tableDragLine') {
                    n.parentNode.removeChild(n);
                }
            });
        });

        var currentRowIndex = 0;
        me.addListener("mousedown", function () {
            currentRowIndex = 0;
        });
        me.addListener('tabkeydown', function () {
            var range = this.selection.getRange(),
                common = range.getCommonAncestor(true, true),
                table = JUtils.findParentByTagName(common, 'table');
            if (table) {
                if (JUtils.findParentByTagName(common, 'caption', true)) {
                    var cell = JUtils.getElementsByTagName(table, 'th td');
                    if (cell && cell.length) {
                        range.setStart(cell[0], 0).setCursor(false, true)
                    }
                } else {
                    var cell = JUtils.findParentByTagName(common, ['td', 'th'], true),
                        ua = getUETable(cell);
                    currentRowIndex = cell.rowSpan > 1 ? currentRowIndex : ua.getCellInfo(cell).rowIndex;
                    var nextCell = ua.getTabNextCell(cell, currentRowIndex);
                    if (nextCell) {
                        if (isEmptyBlock(nextCell)) {
                            range.setStart(nextCell, 0).setCursor(false, true)
                        } else {
                            range.selectNodeContents(nextCell).select()
                        }
                    } else {
                        me.fireEvent('saveScene');
                        me.__hasEnterExecCommand = true;
                        this.execCommand('insertrownext');
                        me.__hasEnterExecCommand = false;
                        range = this.selection.getRange();
                        range.setStart(table.rows[table.rows.length - 1].cells[0], 0).setCursor();
                        me.fireEvent('saveScene');
                    }
                }
                return true;
            }

        });
        browser.ie && me.addListener('selectionchange', function () {
            toggleDraggableState(this, false, "", null);
        });
        me.addListener("keydown", function (type, evt) {
            var me = this;
            //处理在表格的最后一个输入tab产生新的表格
            var keyCode = evt.keyCode || evt.which;
            if (keyCode == 8 || keyCode == 46) {
                return;
            }
            var notCtrlKey = !evt.ctrlKey && !evt.metaKey && !evt.shiftKey && !evt.altKey;
            notCtrlKey && removeSelectedClass(JUtils.getElementsByTagName(me, "td"));
            var ut = getUETableBySelected(me);
            if (!ut) return;
            notCtrlKey && ut.clearSelected();
        });

        me.addListener("beforegetcontent", function () {
            switchBorderColor(this, false);
            browser.ie && JUtils.each(this.document.getElementsByTagName('caption'), function (ci) {
                if (JUtils.isEmptyNode(ci)) {
                    ci.innerHTML = '&nbsp;'
                }
            });
        });
        me.addListener("aftergetcontent", function () {
            switchBorderColor(this, true);
        });
        me.addListener("getAllHtml", function () {
            removeSelectedClass(me.document.getElementsByTagName("td"));
        });
        //修正全屏状态下插入的表格宽度在非全屏状态下撑开编辑器的情况
        me.addListener("fullscreenchanged", function (type, fullscreen) {
            if (!fullscreen) {
                var ratio = this.offsetWidth / document.offsetWidth,
                    tables = JUtils.getElementsByTagName(this, "table");
                JUtils.each(tables, function (table) {
                    if (table.offsetWidth < me.offsetWidth) return false;
                    var tds = JUtils.getElementsByTagName(table, "td"),
                        backWidths = [];
                    JUtils.each(tds, function (td) {
                        backWidths.push(td.offsetWidth);
                    });
                    for (var i = 0, td; td = tds[i]; i++) {
                        td.setAttribute("width", Math.floor(backWidths[i] * ratio));
                    }
                    table.setAttribute("width", Math.floor(getTableWidth(me, needIEHack, getDefaultValue(me))))
                });
            }
        });

        //重写execCommand命令，用于处理框选时的处理
        var oldExecCommand = me.execCommand;
        me.execCommand = function (cmd, datatat) {

            var me = this,
                args = arguments;

            cmd = cmd.toLowerCase();
            var ut = getUETableBySelected(me), tds,
                range = new dom.Range(me.document),
                cmdFun = me.commands[cmd] || JT.commands[cmd],
                result;
            if (!cmdFun) return;
            if (ut && !commands[cmd] && !cmdFun.notNeedUndo && !me.__hasEnterExecCommand) {
                me.__hasEnterExecCommand = true;
                me.fireEvent("beforeexeccommand", cmd);
                tds = ut.selectedTds;
                var lastState = -2, lastValue = -2, value, state;
                for (var i = 0, td; td = tds[i]; i++) {
                    if (isEmptyBlock(td)) {
                        range.setStart(td, 0).setCursor(false, true)
                    } else {
                        range.selectNode(td).select(true);
                    }
                    state = me.queryCommandState(cmd);
                    value = me.queryCommandValue(cmd);
                    if (state != -1) {
                        if (lastState !== state || lastValue !== value) {
                            me._ignoreContentChange = true;
                            result = oldExecCommand.apply(me, arguments);
                            me._ignoreContentChange = false;

                        }
                        lastState = me.queryCommandState(cmd);
                        lastValue = me.queryCommandValue(cmd);
                        if (JUtils.isEmptyBlock(td)) {
                            JUtils.fillNode(me.document, td)
                        }
                    }
                }
                range.setStart(tds[0], 0).shrinkBoundary(true).setCursor(false, true);
                me.fireEvent('contentchange');
                me.fireEvent("afterexeccommand", cmd);
                me.__hasEnterExecCommand = false;
                me._selectionChange();
            } else {
                result = oldExecCommand.apply(me, arguments);
            }
            return result;
        };


    });
    /**
     * 删除obj的宽高style，改成属性宽高
     * @param obj
     * @param replaceToProperty
     */
    function removeStyleSize(obj, replaceToProperty) {
        removeStyle(obj, "width", true);
        removeStyle(obj, "height", true);
    }

    function removeStyle(obj, styleName, replaceToProperty) {
        if (obj.style[styleName]) {
            replaceToProperty && obj.setAttribute(styleName, parseInt(obj.style[styleName], 10));
            obj.style[styleName] = "";
        }
    }

    function getParentTdOrTh(ele) {
        if (ele.tagName == "TD" || ele.tagName == "TH") return ele;
        var td;
        if (td = JUtils.findParentByTagName(ele, "td", true) || JUtils.findParentByTagName(ele, "th", true)) return td;
        return null;
    }

    function isEmptyBlock(node) {
        var reg = new RegExp(JUtils.fillChar, 'g');
        if (node[browser.ie ? 'innerText' : 'textContent'].replace(/^\s*$/, '').replace(reg, '').length > 0) {
            return 0;
        }
        for (var n in dtd.$isNotEmpty) {
            if (node.getElementsByTagName(n).length) {
                return 0;
            }
        }
        return 1;
    }


    function mouseCoords(evt) {
        if (evt.pageX || evt.pageY) {
            return { x:evt.pageX, y:evt.pageY };
        }
        return {
            x:evt.clientX + me.document.scrollLeft - me.document.clientLeft,
            y:evt.clientY + me.document.scrollTop - me.document.clientTop
        };
    }

    function mouseMoveEvent(evt) {

        if( isEditorDisabled() ) {
            return;
        }

        try {

            //普通状态下鼠标移动
            var target = getParentTdOrTh(evt.target || evt.srcElement),
                pos;

            //区分用户的行为是拖动还是双击
            if( isInResizeBuffer  ) {

                me.style.webkitUserSelect = 'none';

                if( Math.abs( userActionStatus.x - evt.clientX ) > offsetOfTableCell || Math.abs( userActionStatus.y - evt.clientY ) > offsetOfTableCell ) {
                    clearTableDragTimer();
                    isInResizeBuffer = false;
                    singleClickState = 0;
                    //drag action
                    tableBorderDrag(evt);
                }
            }

            //修改单元格大小时的鼠标移动
            if (onDrag && dragTd) {
                singleClickState = 0;
                me.style.webkitUserSelect = 'none';
                me.selection.getNative()[browser.ie9below ? 'empty' : 'removeAllRanges']();
                pos = mouseCoords(evt);
                toggleDraggableState(me, true, onDrag, pos, target);
                if (onDrag == "h") {
                    dragLine.style.left = getPermissionX(dragTd, evt) + "px";
                } else if (onDrag == "v") {
                    dragLine.style.top = getPermissionY(dragTd, evt) + "px";
                }
                return;
            }
            //当鼠标处于table上时，修改移动过程中的光标状态
            if (target) {
                //针对使用table作为容器的组件不触发拖拽效果
                if (me.fireEvent('excludetable', target) === true)
                    return;
                pos = mouseCoords(evt);
                var state = getRelation(target, pos),
                    table = JUtils.findParentByTagName(target, "table", true);

                if (inTableSide(table, target, evt, true)) {
                    if (me.fireEvent("excludetable", table) === true) return;
                    me.style.cursor = "url(" + me.options.cursorpath + "h.png),pointer";
                } else if (inTableSide(table, target, evt)) {
                    if (me.fireEvent("excludetable", table) === true) return;
                    me.style.cursor = "url(" + me.options.cursorpath + "v.png),pointer";
                } else {
                    me.style.cursor = "text";
                    var curCell = target;
                    if (/\d/.test(state)) {
                        state = state.replace(/\d/, '');
                        target = getUETable(target).getPreviewCell(target, state == "v");
                    }
                    //位于第一行的顶部或者第一列的左边时不可拖动
                    toggleDraggableState(me, target ? !!state : false, target ? state : '', pos, target);

                }
            } else {
                toggleDragButton(false, table, me);
            }

        } catch (e) {
            showError(e);
        }
    }

    var dragButtonTimer;

    function toggleDragButton(show, table, editor) {
        if (!show) {
            if (dragOver)return;
            dragButtonTimer = setTimeout(function () {
                !dragOver && dragButton && dragButton.parentNode && dragButton.parentNode.removeChild(dragButton);
            }, 2000);
        } else {
            createDragButton(table, editor);
        }
    }

    function createDragButton(table, editor) {
        var pos = JUtils.getXY(table),
            doc = table.ownerDocument;
        if (dragButton && dragButton.parentNode)return dragButton;
        dragButton = doc.createElement("div");
        dragButton.contentEditable = false;
        dragButton.innerHTML = "";
        dragButton.style.cssText = "width:15px;height:15px;background-image:url(" + editor.options.UEDITOR_HOME_URL + "dialogs/table/dragicon.png);position: absolute;cursor:move;top:" + (pos.y - 15) + "px;left:" + (pos.x) + "px;";
        JUtils.unSelectable(dragButton);
        dragButton.onmouseover = function (evt) {
            dragOver = true;
        };
        dragButton.onmouseout = function (evt) {
            dragOver = false;
        };
        JUtils.on(dragButton, 'click', function (type, evt) {
            doClick(evt, this);
        });
        JUtils.on(dragButton, 'dblclick', function (type, evt) {
            doDblClick(evt);
        });
        JUtils.on(dragButton, 'dragstart', function (type, evt) {
            JUtils.preventDefault(evt);
        });
        var timer;

        function doClick(evt, button) {
            // 部分浏览器下需要清理
            clearTimeout(timer);
            timer = setTimeout(function () {
                editor.fireEvent("tableClicked", table, button);
            }, 300);
        }

        function doDblClick(evt) {
            clearTimeout(timer);
            var ut = getUETable(table),
                start = table.rows[0].cells[0],
                end = ut.getLastCell(),
                range = ut.getCellsRange(start, end);
            editor.selection.getRange().setStart(start, 0).setCursor(false, true);
            ut.setSelected(range);
        }

        doc.body.appendChild(dragButton);
    }
    function inTableSide(table, cell, evt, top) {
        var pos = mouseCoords(evt),
            state = getRelation(cell, pos);

        if (top) {
            var caption = table.getElementsByTagName("caption")[0],
                capHeight = caption ? caption.offsetHeight : 0;
            return (state == "v1") && ((pos.y - JUtils.getXY(table).y - capHeight) < 8);
        } else {
            return (state == "h1") && ((pos.x - JUtils.getXY(table).x) < 8);
        }
    }

    /**
     * 获取拖动时允许的X轴坐标
     * @param dragTd
     * @param evt
     */
    function getPermissionX(dragTd, evt) {
        var ut = getUETable(dragTd);
        if (ut) {
            var preTd = ut.getSameEndPosCells(dragTd, "x")[0],
                nextTd = ut.getSameStartPosXCells(dragTd)[0],
                mouseX = mouseCoords(evt).x,
                left = (preTd ? JUtils.getXY(preTd).x : JUtils.getXY(ut.table).x) + 20 ,
                right = nextTd ? JUtils.getXY(nextTd).x + nextTd.offsetWidth - 20 : (me.offsetWidth + 5 || parseInt(JUtils.getComputedStyle(me, "width"), 10));

            left += cellMinWidth;
            right -= cellMinWidth;

            return mouseX < left ? left : mouseX > right ? right : mouseX;
        }
    }

    /**
     * 获取拖动时允许的Y轴坐标
     */
    function getPermissionY(dragTd, evt) {
        try {
            var top = JUtils.getXY(dragTd).y,
                mousePosY = mouseCoords(evt).y;
            return mousePosY < top ? top : mousePosY;
        } catch (e) {
            showError(e);
        }
    }

    /**
     * 移动状态切换
     */
    function toggleDraggableState(editor, draggable, dir, mousePos, cell) {
        try {
            editor.style.cursor = dir == "h" ? "col-resize" : dir == "v" ? "row-resize" : "text";
            if (browser.ie) {
                if (dir && !mousedown && !getUETableBySelected(editor)) {
                    getDragLine(editor, editor.document);
                    showDragLineAt(dir, cell);
                } else {
                    hideDragLine(editor)
                }
            }
            onBorder = draggable;
        } catch (e) {
            showError(e);
        }
    }

    /**
     * 获取与UETable相关的resize line
     * @param uetable UETable对象
     */
    function getResizeLineByUETable() {

        var lineId = '_UETableResizeLine',
            line = this.document.getElementById( lineId );

        if( !line ) {
            line = this.document.createElement("div");
            line.id = lineId;
            line.contnetEditable = false;
            line.setAttribute("unselectable", "on");

            var styles = {
                width: 2*cellBorderWidth + 1 + 'px',
                position: 'absolute',
                'z-index': 100000,
                cursor: 'col-resize',
                background: 'red',
                display: 'none'
            };

            //切换状态
            line.onmouseout = function(){
                this.style.display = 'none';
            };

            JUtils.extend( line.style, styles );

            this.document.appendChild( line );

        }

        return line;

    }

    /**
     * 更新resize-line
     */
    function updateResizeLine( cell, uetable ) {

        var line = getResizeLineByUETable.call( this ),
            table = uetable.table,
            styles = {
                top: JUtils.getXY( table ).y + 'px',
                left: JUtils.getXY( cell).x + cell.offsetWidth - cellBorderWidth + 'px',
                display: 'block',
                height: table.offsetHeight + 'px'
            };

        JUtils.extend( line.style, styles );

    }

    /**
     * 显示resize-line
     */
    function showResizeLine( cell ) {

        var uetable = getUETable( cell );

        updateResizeLine.call( this, cell, uetable );

    }

    /**
     * 获取鼠标与当前单元格的相对位置
     * @param ele
     * @param mousePos
     */
    function getRelation(ele, mousePos) {
        var elePos = JUtils.getXY(ele);

        if( !elePos ) {
            return '';
        }

        if (elePos.x + ele.offsetWidth - mousePos.x < cellBorderWidth) {
            return "h";
        }
        if (mousePos.x - elePos.x < cellBorderWidth) {
            return 'h1'
        }
        if (elePos.y + ele.offsetHeight - mousePos.y < cellBorderWidth) {
            return "v";
        }
        if (mousePos.y - elePos.y < cellBorderWidth) {
            return 'v1'
        }
        return '';
    }

    function mouseDownEvent(type, evt) {

        if( isEditorDisabled() ) {
            return ;
        }

        userActionStatus = {
            x: evt.clientX,
            y: evt.clientY
        };

        //右键菜单单独处理
        if (evt.button == 2) {
            var ut = getUETableBySelected(me),
                flag = false;

            if (ut) {
                var td = getTargetTd(me, evt);
                JUtils.each(ut.selectedTds, function (ti) {
                    if (ti === td) {
                        flag = true;
                    }
                });
                if (!flag) {
                    removeSelectedClass(JUtils.getElementsByTagName(me, "th td"));
                    ut.clearSelected()
                } else {
                    td = ut.selectedTds[0];
                    setTimeout(function () {
                        me.selection.getRange().setStart(td, 0).setCursor(false, true);
                    }, 0);

                }
            }
        } else {
            tableClickHander( evt );
        }

    }

    //清除表格的计时器
    function clearTableTimer() {
        tabTimer && clearTimeout( tabTimer );
        tabTimer = null;
    }

    //双击收缩
    function tableDbclickHandler(evt) {
        singleClickState = 0;
        evt = evt || me.window.event;
        var target = getParentTdOrTh(evt.target || evt.srcElement);
        if (target) {
            var h;
            if (h = getRelation(target, mouseCoords(evt))) {

                hideDragLine( me );

                if (h == 'h1') {
                    h = 'h';
                    if (inTableSide(JUtils.findParentByTagName(target, "table"), target, evt)) {
                        me.execCommand('adaptbywindow');
                    } else {
                        target = getUETable(target).getPreviewCell(target);
                        if (target) {
                            var rng = me.selection.getRange();
                            rng.selectNodeContents(target).setCursor(true, true)
                        }
                    }
                }
                if (h == 'h') {
                    var ut = getUETable(target),
                        table = ut.table,
                        cells = getCellsByMoveBorder( target, table, true );

                    cells = extractArray( cells, 'left' );

                    ut.width = ut.offsetWidth;

                    var oldWidth = [],
                        newWidth = [];

                    JUtils.each( cells, function( cell ){

                        oldWidth.push( cell.offsetWidth );

                    } );

                    JUtils.each( cells, function( cell ){

                        cell.removeAttribute("width");

                    } );

                    window.setTimeout( function(){

                        //是否允许改变
                        var changeable = true;

                        JUtils.each( cells, function( cell, index ){

                            var width = cell.offsetWidth;

                            if( width > oldWidth[index] ) {
                                changeable = false;
                                return false;
                            }

                            newWidth.push( width );

                        } );

                        var change = changeable ? newWidth : oldWidth;

                        JUtils.each( cells, function( cell, index ){

                            cell.width = change[index] - getTabcellSpace();

                        } );


                    }, 0 );
                }
            }
        }
    }

    function tableClickHander( evt ) {

        removeSelectedClass(JUtils.getElementsByTagName(me, "td th"));
        //trace:3113
        //选中单元格，点击table外部，不会清掉table上挂的ueTable,会引起getUETableBySelected方法返回值
        JUtils.each(me.document.getElementsByTagName('table'), function (t) {
            t.ueTable = null;
        });
        startTd = getTargetTd(me, evt);
        if( !startTd ) return;
        var table = JUtils.findParentByTagName(startTd, "table", true);
        ut = getUETable(table);
        ut && ut.clearSelected();

        //判断当前鼠标状态
        if (!onBorder) {
            me.document.style.webkitUserSelect = '';
            mousedown = true;
            me.addListener('mouseover', mouseOverEvent);
        } else {
            //边框上的动作处理
            borderActionHandler( evt );
        }


    }

    //处理表格边框上的动作, 这里做延时处理，避免两种动作互相影响
    function borderActionHandler( evt ) {

        if ( browser.ie ) {
            evt = reconstruct(evt );
        }

        clearTableDragTimer();

        //是否正在等待resize的缓冲中
        isInResizeBuffer = true;

        tableDragTimer = setTimeout(function(){
            tableBorderDrag( evt );
        }, dblclickTime);

    }

    function extractArray( originArr, key ) {

        var result = [],
            tmp = null;

        for( var i = 0, len = originArr.length; i<len; i++ ) {

            tmp = originArr[ i ][ key ];

            if( tmp ) {
                result.push( tmp );
            }

        }

        return result;

    }

    function clearTableDragTimer() {
        tableDragTimer && clearTimeout(tableDragTimer);
        tableDragTimer = null;
    }

    function reconstruct( obj ) {

        var attrs = ['pageX', 'pageY', 'clientX', 'clientY', 'srcElement', 'target'],
            newObj = {};

        if( obj ) {

            for( var i = 0, key, val; key = attrs[i]; i++ ) {
                val=obj[ key ];
                val && (newObj[ key ] = val);
            }

        }

        return newObj;

    }

    //边框拖动
    function tableBorderDrag( evt ) {

        isInResizeBuffer = false;

        startTd = evt.target || evt.srcElement;
        if( !startTd ) return;
        var state = getRelation(startTd, mouseCoords(evt));
        if (/\d/.test(state)) {
            state = state.replace(/\d/, '');
            startTd = getUETable(startTd).getPreviewCell(startTd, state == 'v');
        }
        hideDragLine(me);
        getDragLine(me, me.document);
        me.fireEvent('saveScene');
        showDragLineAt(state, startTd);
        mousedown = true;
        //拖动开始
        onDrag = state;
        dragTd = startTd;
    }

    function mouseUpEvent(type, evt) {

        if( isEditorDisabled() ) {
            return ;
        }

        clearTableDragTimer();

        isInResizeBuffer = false;

        if( onBorder ) {
            singleClickState = ++singleClickState % 3;

            userActionStatus = {
                x: evt.clientX,
                y: evt.clientY
            };

            tableResizeTimer = setTimeout(function(){
                singleClickState > 0 && singleClickState--;
            }, dblclickTime );

            if( singleClickState === 2 ) {

                singleClickState = 0;
                tableDbclickHandler(evt);
                return;

            }

        }

        if (evt.button == 2)return;
        var me = this;
        //清除表格上原生跨选问题
        var range = me.selection.getRange(),
            start = JUtils.findParentByTagName(range.startContainer, 'table', true),
            end = JUtils.findParentByTagName(range.endContainer, 'table', true);

        if (start || end) {
            if (start === end) {
                start = JUtils.findParentByTagName(range.startContainer, ['td', 'th', 'caption'], true);
                end = JUtils.findParentByTagName(range.endContainer, ['td', 'th', 'caption'], true);
                if (start !== end) {
                    me.selection.clearRange()
                }
            } else {
                me.selection.clearRange()
            }
        }
        mousedown = false;
        me.document.style.webkitUserSelect = '';
        //拖拽状态下的mouseUP
        if ( onDrag && dragTd ) {

            me.selection.getNative()[browser.ie9below ? 'empty' : 'removeAllRanges']();

            singleClickState = 0;
            dragLine = me.document.getElementById('ue_tableDragLine');

            // trace 3973
            if (dragLine) {
                var dragTdPos = JUtils.getXY(dragTd),
                    dragLinePos = JUtils.getXY(dragLine);

                switch (onDrag) {
                    case "h":
                        changeColWidth(dragTd, dragLinePos.x - dragTdPos.x);
                        break;
                    case "v":
                        changeRowHeight(dragTd, dragLinePos.y - dragTdPos.y - dragTd.offsetHeight);
                        break;
                    default:
                }
                onDrag = "";
                dragTd = null;

                hideDragLine(me);
                me.fireEvent('saveScene');
                return;
            }
        }
        //正常状态下的mouseup
        if (!startTd) {
            var target = JUtils.findParentByTagName(evt.target || evt.srcElement, "td", true);
            if (!target) target = JUtils.findParentByTagName(evt.target || evt.srcElement, "th", true);
            if (target && (target.tagName == "TD" || target.tagName == "TH")) {
                if (me.fireEvent("excludetable", target) === true) return;
                range = new dom.Range(me.document);
                range.setStart(target, 0).setCursor(false, true);
            }
        } else {
            var ut = getUETable(startTd),
                cell = ut ? ut.selectedTds[0] : null;
            if (cell) {
                range = new dom.Range(me.document);
                if (JUtils.isEmptyBlock(cell)) {
                    range.setStart(cell, 0).setCursor(false, true);
                } else {
                    range.selectNodeContents(cell).shrinkBoundary().setCursor(false, true);
                }
            } else {
                range = me.selection.getRange().shrinkBoundary();
                if (!range.collapsed) {
                    var start = JUtils.findParentByTagName(range.startContainer, ['td', 'th'], true),
                        end = JUtils.findParentByTagName(range.endContainer, ['td', 'th'], true);
                    //在table里边的不能清除
                    if (start && !end || !start && end || start && end && start !== end) {
                        range.setCursor(false, true);
                    }
                }
            }
            startTd = null;
            me.removeListener('mouseover', mouseOverEvent);
        }
        me._selectionChange(250, evt);
    }

    function mouseOverEvent(type, evt) {

        if( isEditorDisabled() ) {
            return;
        }

        var me = this,
            tar = evt.target || evt.srcElement;
        currentTd = JUtils.findParentByTagName(tar, "td", true) || JUtils.findParentByTagName(tar, "th", true);
        //需要判断两个TD是否位于同一个表格内
        if (startTd && currentTd &&
            ((startTd.tagName == "TD" && currentTd.tagName == "TD") || (startTd.tagName == "TH" && currentTd.tagName == "TH")) &&
            JUtils.findParentByTagName(startTd, 'table') == JUtils.findParentByTagName(currentTd, 'table')) {
            var ut = getUETable(currentTd);
            if (startTd != currentTd) {
                me.document.style.webkitUserSelect = 'none';
                me.selection.getNative()[browser.ie9below ? 'empty' : 'removeAllRanges']();
                var range = ut.getCellsRange(startTd, currentTd);
                ut.setSelected(range);
            } else {
                me.document.style.webkitUserSelect = '';
                ut.clearSelected();
            }

        }
        evt.preventDefault ? evt.preventDefault() : (evt.returnValue = false);
    }

    function setCellHeight(cell, height, backHeight) {
        var lineHight = parseInt(JUtils.getComputedStyle(cell, "line-height"), 10),
            tmpHeight = backHeight + height;
        height = tmpHeight < lineHight ? lineHight : tmpHeight;
        if (cell.style.height) cell.style.height = "";
        cell.rowSpan == 1 ? cell.setAttribute("height", height) : (cell.removeAttribute && cell.removeAttribute("height"));
    }

    function getWidth(cell) {
        if (!cell)return 0;
        return parseInt(JUtils.getComputedStyle(cell, "width"), 10);
    }

    function changeColWidth(cell, changeValue) {

        var ut = getUETable(cell);
        if (ut) {

            //根据当前移动的边框获取相关的单元格
            var table = ut.table,
                cells = getCellsByMoveBorder( cell, table );

            table.style.width = "";
            table.removeAttribute("width");

            //修正改变量
            changeValue = correctChangeValue( changeValue, cell, cells );

            if (cell.nextSibling) {

                var i=0;

                JUtils.each( cells, function( cellGroup ){

                    cellGroup.left.width = (+cellGroup.left.width)+changeValue;
                    cellGroup.right && ( cellGroup.right.width = (+cellGroup.right.width)-changeValue );

                } );

            } else {

                JUtils.each( cells, function( cellGroup ){
                    cellGroup.left.width -= -changeValue;
                } );

            }
        }

    }

    function isEditorDisabled() {
        return me.contentEditable === "false";
    }

    function changeRowHeight(td, changeValue) {
        if (Math.abs(changeValue) < 10) return;
        var ut = getUETable(td);
        if (ut) {
            var cells = ut.getSameEndPosCells(td, "y"),
            //备份需要连带变化的td的原始高度，否则后期无法获取正确的值
                backHeight = cells[0] ? cells[0].offsetHeight : 0;
            for (var i = 0, cell; cell = cells[i++];) {
                setCellHeight(cell, changeValue, backHeight);
            }
        }

    }

    /**
     * 获取调整单元格大小的相关单元格
     * @isContainMergeCell 返回的结果中是否包含发生合并后的单元格
     */
    function getCellsByMoveBorder( cell, table, isContainMergeCell ) {

        if( !table ) {
            table = JUtils.findParentByTagName( cell, 'table' );
        }

        if( !table ) {
            return null;
        }

        //获取到该单元格所在行的序列号
        var index = JUtils.getNodeIndex( cell ),
            temp = cell,
            rows = table.rows,
            colIndex = 0;

        while( temp ) {
            //获取到当前单元格在未发生单元格合并时的序列
            if( temp.nodeType === 1 ) {
                colIndex += (temp.colSpan || 1);
            }
            temp = temp.previousSibling;
        }

        temp = null;

        //记录想关的单元格
        var borderCells = [];

        JUtils.each(rows, function( tabRow ){

            var cells = tabRow.cells,
                currIndex = 0;

            JUtils.each( cells, function( tabCell ){

                currIndex += (tabCell.colSpan || 1);

                if( currIndex === colIndex ) {

                    borderCells.push({
                        left: tabCell,
                        right: tabCell.nextSibling || null
                    });

                    return false;

                } else if( currIndex > colIndex ) {

                    if( isContainMergeCell ) {
                        borderCells.push({
                            left: tabCell
                        });
                    }

                    return false;
                }


            } );

        });

        return borderCells;

    }


    /**
     * 通过给定的单元格集合获取最小的单元格width
     */
    function getMinWidthByTableCells( cells ) {

        var minWidth = Number.MAX_VALUE;

        for( var i = 0, curCell; curCell = cells[ i ] ; i++ ) {

            minWidth = Math.min( minWidth, curCell.width || getTableCellWidth( curCell ) );

        }

        return minWidth;

    }

    function correctChangeValue( changeValue, relatedCell, cells ) {

        //为单元格的paading预留空间
        changeValue -= getTabcellSpace();

        if( changeValue < 0 ) {
            return 0;
        }

        changeValue -= getTableCellWidth( relatedCell );

        //确定方向
        var direction = changeValue < 0 ? 'left':'right';

        changeValue = Math.abs(changeValue);

        //只关心非最后一个单元格就可以
        JUtils.each( cells, function( cellGroup ){

            var curCell = cellGroup[direction];

            //为单元格保留最小空间
            if( curCell ) {
                changeValue = Math.min( changeValue, getTableCellWidth( curCell )-cellMinWidth );
            }


        } );


        //修正越界
        changeValue = changeValue < 0 ? 0 : changeValue;

        return direction === 'left' ? -changeValue : changeValue;

    }

    function getTableCellWidth( cell ) {

        var width = 0,
        //偏移纠正量
            offset = 0,
            width = cell.offsetWidth - getTabcellSpace();

        //最后一个节点纠正一下
        if( !cell.nextSibling ) {

            width -= getTableCellOffset( cell );

        }

        width = width < 0 ? 0 : width;

        try {
            cell.width = width;
        } catch(e) {
        }

        return width;

    }

    /**
     * 获取单元格所在表格的最末单元格的偏移量
     */
    function getTableCellOffset( cell ) {

        tab = JUtils.findParentByTagName( cell, "table", false);

        if( tab.offsetVal === undefined ) {

            var prev = cell.previousSibling;

            if( prev ) {

                //最后一个单元格和前一个单元格的width diff结果 如果恰好为一个border width， 则条件成立
                tab.offsetVal = cell.offsetWidth - prev.offsetWidth === UT.borderWidth ? UT.borderWidth : 0;

            } else {
                tab.offsetVal = 0;
            }

        }

        return tab.offsetVal;

    }

    function getTabcellSpace() {

        if( UT.tabcellSpace === undefined ) {

            var cell = null,
                tab = me.document.createElement("table"),
                tbody = me.document.createElement("tbody"),
                trow = me.document.createElement("tr"),
                tabcell = me.document.createElement("td"),
                mirror = null;

            tabcell.style.cssText = 'border: 0;';
            tabcell.width = 1;

            trow.appendChild( tabcell );
            trow.appendChild( mirror = tabcell.cloneNode( false ) );

            tbody.appendChild( trow );

            tab.appendChild( tbody );

            tab.style.cssText = "visibility: hidden;";

            me.appendChild( tab );

            UT.paddingSpace = tabcell.offsetWidth - 1;

            var tmpTabWidth = tab.offsetWidth;

            tabcell.style.cssText = '';
            mirror.style.cssText = '';

            UT.borderWidth = ( tab.offsetWidth - tmpTabWidth ) / 3;

            UT.tabcellSpace = UT.paddingSpace + UT.borderWidth;

            me.removeChild( tab );

        }

        getTabcellSpace = function(){ return UT.tabcellSpace; };

        return UT.tabcellSpace;

    }

    function getDragLine(editor, doc) {
        if (mousedown)return;
        dragLine = editor.document.createElement("div");
        JUtils.setAttributes(dragLine, {
            id:"ue_tableDragLine",
            unselectable:'on',
            contenteditable:false,
            'onresizestart':'return false',
            'ondragstart':'return false',
            'onselectstart':'return false',
            style:"background-color:blue;position:absolute;padding:0;margin:0;background-image:none;border:0px none;opacity:0;filter:alpha(opacity=0)"
        });
        editor.appendChild(dragLine);
    }

    function hideDragLine(editor) {
        if (mousedown)return;
        var line;
        while (line = editor.document.getElementById('ue_tableDragLine')) {
            JUtils.remove(line)
        }
    }

    /**
     * 依据state（v|h）在cell位置显示横线
     * @param state
     * @param cell
     */
    function showDragLineAt(state, cell) {
        if (!cell) return;
        var table = JUtils.findParentByTagName(cell, "table"),
            caption = table.getElementsByTagName('caption'),
            width = table.offsetWidth,
            height = table.offsetHeight - (caption.length > 0 ? caption[0].offsetHeight : 0),
            tablePos = JUtils.getXY(table),
            cellPos = JUtils.getXY(cell), css;
        switch (state) {
            case "h":
                css = 'height:' + height + 'px;top:' + (tablePos.y + (caption.length > 0 ? caption[0].offsetHeight : 0)) + 'px;left:' + (cellPos.x + cell.offsetWidth);
                dragLine.style.cssText = css + 'px;position: absolute;display:block;background-color:blue;width:1px;border:0; color:blue;opacity:.3;filter:alpha(opacity=30)';
                break;
            case "v":
                css = 'width:' + width + 'px;left:' + tablePos.x + 'px;top:' + (cellPos.y + cell.offsetHeight );
                //必须加上border:0和color:blue，否则低版ie不支持背景色显示
                dragLine.style.cssText = css + 'px;overflow:hidden;position: absolute;display:block;background-color:blue;height:1px;border:0;color:blue;opacity:.2;filter:alpha(opacity=20)';
                break;
            default:
        }
    }

    /**
     * 当表格边框颜色为白色时设置为虚线,true为添加虚线
     * @param editor
     * @param flag
     */
    function switchBorderColor(editor, flag) {
        var tableArr = JUtils.getElementsByTagName(editor.container, "table"), color;
        for (var i = 0, node; node = tableArr[i++];) {
            var td = JUtils.getElementsByTagName(node, "td");
            if (td[0]) {
                if (flag) {
                    color = (td[0].style.borderColor).replace(/\s/g, "");
                    if (/(#ffffff)|(rgb\(255,255,255\))/ig.test(color))
                        JUtils.addClass(node, "noBorderTable")
                } else {
                    JUtils.removeClasses(node, "noBorderTable")
                }
            }

        }
    }

    function getTableWidth(editor, needIEHack, defaultValue) {
        var body = editor;
        return body.offsetWidth - (needIEHack ? parseInt(JUtils.getComputedStyle(body, 'margin-left'), 10) * 2 : 0) - defaultValue.tableBorder * 2 - (editor.options.offsetWidth || 0);
    }

    /**
     * 获取当前拖动的单元格
     */
    function getTargetTd(editor, evt) {

        var target = JUtils.findParentByTagName(evt.target || evt.srcElement, ["td", "th"], true),
            dir = null;

        if( !target ) {
            return null;
        }

        dir = getRelation( target, mouseCoords( evt ) );

        //如果有前一个节点， 需要做一个修正， 否则可能会得到一个错误的td

        if( !target ) {
            return null;
        }

        if( dir === 'h1' && target.previousSibling ) {

            var position = JUtils.getXY( target),
                cellWidth = target.offsetWidth;

            if( Math.abs( position.x + cellWidth - evt.clientX ) > cellWidth / 3 ) {
                target = target.previousSibling;
            }

        } else if( dir === 'v1' && target.parentNode.previousSibling ) {

            var position = JUtils.getXY( target),
                cellHeight = target.offsetHeight;

            if( Math.abs( position.y + cellHeight - evt.clientY ) > cellHeight / 3 ) {
                target = target.parentNode.previousSibling.firstChild;
            }

        }

        //排除了非td内部以及用于代码高亮部分的td
        return target && !(editor.fireEvent("excludetable", target) === true) ? target : null;
    }
};

var JCommand = JT.JCommand = {
    load: function (table) {

    },
    getDefaultValue: function (editor, table) {
        var borderMap = {
                thin: '0px',
                medium: '1px',
                thick: '2px'
            },
            tableBorder, tdPadding, tdBorder, tmpValue;
        if (!table) {
            table = document.createElement('table');
            //table.setAttribute("contenteditable",true);
            table.insertRow(0).insertCell(0).innerHTML = 'xxx';
            editor.container.appendChild(table);
            var td = table.getElementsByTagName('td')[0];
            tmpValue = JUtils.getComputedStyle(table, 'border-left-width');
            tableBorder = parseInt(borderMap[tmpValue] || tmpValue, 10);
            tmpValue = JUtils.getComputedStyle(td, 'padding-left');
            tdPadding = parseInt(borderMap[tmpValue] || tmpValue, 10);
            tmpValue = JUtils.getComputedStyle(td, 'border-left-width');
            tdBorder = parseInt(borderMap[tmpValue] || tmpValue, 10);
            JUtils.remove(table);
            return {
                tableBorder: tableBorder,
                tdPadding: tdPadding,
                tdBorder: tdBorder
            };
        } else {
            td = table.getElementsByTagName('td')[0];
            tmpValue = JUtils.getComputedStyle(table, 'border-left-width');
            tableBorder = parseInt(borderMap[tmpValue] || tmpValue, 10);
            tmpValue = JUtils.getComputedStyle(td, 'padding-left');
            tdPadding = parseInt(borderMap[tmpValue] || tmpValue, 10);
            tmpValue = JUtils.getComputedStyle(td, 'border-left-width');
            tdBorder = parseInt(borderMap[tmpValue] || tmpValue, 10);
            return {
                tableBorder: tableBorder,
                tdPadding: tdPadding,
                tdBorder: tdBorder
            };
        }
    }


    //...
};
JT.commands["inserttable"] = {
    queryCommandState: function () {

    },
    execCommand: function (cmd, opt) {
        function createTable(opt, tdWidth) {
            var html = [],//生成的代码
                rowsNum = opt.numRows,//行数
                colsNum = opt.numCols;//列数
            for (var r = 0; r < rowsNum; r++) {
                html.push('<tr' + (r == 0 ? ' class="firstRow"' : '') + '>');
                for (var c = 0; c < colsNum; c++) {
                    html.push('<td width="' + tdWidth + '"  vAlign="' + opt.tdvalign + '" >' + '<br />' + '</td>')
                }
                html.push('</tr>')
            }
            //禁止指定table-width
            return '<table contenteditable="true"><tbody>' + html.join('') + '</tbody></table>'
        }

        opt = JUtils.extend({}, {
            numCols: this.options.defaultCols,
            numRows: this.options.defaultRows,
            tdvalign: this.options.tdvalign,
            tableWidth: this.options.tableWidth
        });
        var me = this;
        var defaultValue = JCommand.getDefaultValue(me),
            tableWidth = opt.tableWidth,//表格宽度
            tdWidth = Math.floor(tableWidth / opt.numCols - defaultValue.tdPadding * 2 - defaultValue.tdBorder);
        var div = me.document.createElement('div');
        div.style.display = 'inline';
        div.innerHTML = createTable(opt, tdWidth);
        me.container.appendChild(div);
        JUtils.cssRule('tableSt',
            this.options.tableStyle+this.options.selectTableStyle, me.document);
        JUtils.remove(div,true);
        me.fireEvent('ready');
        a.fireEvent('contentchange')
        // $(me.container).on('click',function () {
        //
        // });
        
    }
};


/**
 * 当表格边框颜色为白色时设置为虚线,true为添加虚线
 * @param editor
 * @param flag
 */
function switchBorderColor(editor, flag) {
    var tableArr = JUtils.getElementsByTagName(editor, "table"), color;
    for (var i = 0, node; node = tableArr[i++];) {
        var td = JUtils.getElementsByTagName(node, "td");
        if (td[0]) {
            if (flag) {
                color = (td[0].style.borderColor).replace(/\s/g, "");
                if (/(#ffffff)|(rgb\(255,255,255\))/ig.test(color))
                    domUtils.addClass(node, "noBorderTable")
            } else {
                JUtils.removeClasses(node, "noBorderTable")
            }
        }

    }
}

var Selection=JT.dom.Selection=function (doc) {
    
};
Selection.prototype={
    /**
     * 获取原生seleciton对象
     * @method getNative
     * @return { Object } 获得selection对象
     * @example
     * ```javascript
     * editor.selection.getNative();
     * ```
     */
    getNative:function () {
        var doc = this.document;
        try {
            return !doc ? null : browser.ie9below ? doc.selection : JUtils.getWindow( doc ).getSelection();
        } catch ( e ) {
            return null;
        }
    },
    /**
     * 获取选区对应的Range
     * @method getRange
     * @return { Object } 得到Range对象
     * @example
     * ```javascript
     * editor.selection.getRange();
     * ```
     */
    getRange:function () {
        var me = this;
        function optimze( range ) {
            var child = me.firstChild,
                collapsed = range.collapsed;
            while ( child && child.firstChild ) {
                range.setStart( child, 0 );
                child = child.firstChild;
            }
            if ( !range.startContainer ) {
                range.setStart( range.document.body, 0 )
            }
            if ( collapsed ) {
                range.collapse( true );
            }
        }

        if ( me._cachedRange != null ) {
            return this._cachedRange;
        }
        var range = new JT.dom.Range( me.document );

        if ( browser.ie9below ) {
            var nativeRange = me.getIERange();
            if ( nativeRange ) {
                //备份的_bakIERange可能已经实效了，dom树发生了变化比如从源码模式切回来，所以try一下，实效就放到body开始位置
                try{
                    transformIERangeToRange( nativeRange, range );
                }catch(e){
                    optimze( range );
                }

            } else {
                optimze( range );
            }
        } else {
            var sel = me.getNative();
            if ( sel && sel.rangeCount ) {
                var firstRange = sel.getRangeAt( 0 );
                var lastRange = sel.getRangeAt( sel.rangeCount - 1 );
                range.setStart( firstRange.startContainer, firstRange.startOffset ).setEnd( lastRange.endContainer, lastRange.endOffset );
                if ( range.collapsed && JUtils.isBody( range.startContainer ) && !range.startOffset ) {
                    optimze( range );
                }
            } else {
                //trace:1734 有可能已经不在dom树上了，标识的节点
                if ( this._bakRange && JUtils.inDoc( this._bakRange.startContainer, this.document ) ){
                    return this._bakRange;
                }
                optimze( range );
            }
        }
        return this._bakRange = range;
    },
    /**
     * 获取开始元素，用于状态反射
     * @method getStart
     * @return { Element } 获得开始元素
     * @example
     * ```javascript
     * editor.selection.getStart();
     * ```
     */
    getStart:function () {
        if ( this._cachedStartElement ) {
            return this._cachedStartElement;
        }
        var range = browser.ie9below ? this.getIERange() : this.getRange(),
            tmpRange,
            start, tmp, parent;
        if ( browser.ie9below ) {
            if ( !range ) {
                //todo 给第一个值可能会有问题
                return this.document.body.firstChild;
            }
            //control元素
            if ( range.item ){
                return range.item( 0 );
            }
            tmpRange = range.duplicate();
            //修正ie下<b>x</b>[xx] 闭合后 <b>x|</b>xx
            tmpRange.text.length > 0 && tmpRange.moveStart( 'character', 1 );
            tmpRange.collapse( 1 );
            start = tmpRange.parentElement();
            parent = tmp = range.parentElement();
            while ( tmp = tmp.parentNode ) {
                if ( tmp == start ) {
                    start = parent;
                    break;
                }
            }
        } else {
            range.shrinkBoundary();
            start = range.startContainer;
            if ( start.nodeType == 1 && start.hasChildNodes() ){
                start = start.childNodes[Math.min( start.childNodes.length - 1, range.startOffset )];
            }
            if ( start.nodeType == 3 ){
                return start.parentNode;
            }
        }
        return start;
    },
}

var Range=JT.dom.Range=function (doc) {
    var me = this;
    me.startContainer =
        me.startOffset =
            me.endContainer =
                me.endOffset = null;
    me.document = document;
    me.collapsed = true;
};
function setEndPoint(toStart, node, offset, range) {
    //如果node是自闭合标签要处理
    if (node.nodeType == 1) {
        offset = JUtils.getNodeIndex(node) + (toStart ? 0 : 1);
        node = node.parentNode;
    }
    if (toStart) {
        range.startContainer = node;
        range.startOffset = offset;
        if (!range.endContainer) {
            range.collapse(true);
        }
    } else {
        range.endContainer = node;
        range.endOffset = offset;
        if (!range.startContainer) {
            range.collapse(false);
        }
    }
    updateCollapse(range);
    return range;
}
/**
 * 更新range的collapse状态
 * @param  {Range}   range    range对象
 */
function updateCollapse(range) {
    range.collapsed =
        range.startContainer && range.endContainer &&
        range.startContainer === range.endContainer &&
        range.startOffset == range.endOffset;
}
Range.prototype={
    /**
     * 调整range的开始位置和结束位置，使其"收缩"到最小的位置
     * @method  shrinkBoundary
     * @return { UE.dom.Range } 当前range对象
     * @example
     * ```html
     * <span>xx<b>xx[</b>xxxxx]</span> => <span>xx<b>xx</b>[xxxxx]</span>
     * ```
     *
     * @example
     * ```html
     * <!-- 选区示例 -->
     * <b>x[xx</b><i>]xxx</i>
     *
     * <script>
     *
     *     //执行收缩
     *     range.shrinkBoundary();
     *
     *     //结果选区
     *     //<b>x[xx]</b><i>xxx</i>
     * </script>
     * ```
     *
     * @example
     * ```html
     * [<b><i>xxxx</i>xxxxxxx</b>] => <b><i>[xxxx</i>xxxxxxx]</b>
     * ```
     */

    /**
     * 调整range的开始位置和结束位置，使其"收缩"到最小的位置，
     * 如果ignoreEnd的值为true，则忽略对结束位置的调整
     * @method  shrinkBoundary
     * @param { Boolean } ignoreEnd 是否忽略对结束位置的调整
     * @return { UE.dom.Range } 当前range对象
     * @see UE.dom.JUtils.Range:shrinkBoundary()
     */
    shrinkBoundary:function (ignoreEnd) {
        // var me = this, child,
        //     collapsed = me.collapsed;
        // function check(node){
        //     return node.nodeType == 1;
        // }
        // while (me.startContainer.nodeType == 1 //是element
        // && (child = me.startContainer.childNodes[me.startOffset]) //子节点也是element
        // && check(child)) {
        //     me.setStart(child, 0);
        // }
        // if (collapsed) {
        //     return me.collapse(true);
        // }
        // if (!ignoreEnd) {
        //     while (me.endContainer.nodeType == 1//是element
        //     && me.endOffset > 0 //如果是空元素就退出 endOffset=0那么endOffst-1为负值，childNodes[endOffset]报错
        //     && (child = me.endContainer.childNodes[me.endOffset - 1]) //子节点也是element
        //     && check(child)) {
        //         me.setEnd(child, child.childNodes.length);
        //     }
        // }
        // return me;
    },
    /**
     * 设置Range的开始容器节点和偏移量
     * @method  setStart
     * @remind 如果给定的节点是元素节点，那么offset指的是其子元素中索引为offset的元素，
     *          如果是文本节点，那么offset指的是其文本内容的第offset个字符
     * @remind 如果提供的容器节点是一个不能包含子元素的节点， 则该选区的开始容器将被设置
     *          为该节点的父节点， 此时， 其距离开始容器的偏移量也变成了该节点在其父节点
     *          中的索引
     * @param { Node } node 将被设为当前选区开始边界容器的节点对象
     * @param { int } offset 选区的开始位置偏移量
     * @return { UE.dom.Range } 当前range对象
     * @example
     * ```html
     * <!-- 选区 -->
     * <b>xxx<i>x<span>xx</span>xx<em>xx</em>xxx</i>[xxx]</b>
     *
     * <script>
     *
     *     //执行操作
     *     range.setStart( document.getElementsByTagName("i")[0], 1 );
     *
     *     //此时， 选区变成了
     *     //<b>xxx<i>x[<span>xx</span>xx<em>xx</em>xxx</i>xxx]</b>
     *
     * </script>
     * ```
     * @example
     * ```html
     * <!-- 选区 -->
     * <b>xxx<img>[xx]x</b>
     *
     * <script>
     *
     *     //执行操作
     *     range.setStart( document.getElementsByTagName("img")[0], 3 );
     *
     *     //此时， 选区变成了
     *     //<b>xxx[<img>xx]x</b>
     *
     * </script>
     * ```
     */
    setStart:function (node, offset) {
        return setEndPoint(true, node, offset, this);
    },
    /**
     * 向当前选区的结束处闭合选区
     * @method  collapse
     * @return { UE.dom.Range } 当前range对象
     * @example
     * ```html
     * <!-- 选区示例 -->
     * <b>xx<i>xxx</i><span>[xx]x</span>xxx</b>
     *
     * <script>
     *
     *     //执行操作
     *     range.collapse();
     *
     *     //结果选区
     *     //“|”表示选区已闭合
     *     //<b>xx<i>xxx</i><span>xx|x</span>xxx</b>
     *
     * </script>
     * ```
     */

    /**
     * 闭合当前选区，根据给定的toStart参数项决定是向当前选区开始处闭合还是向结束处闭合，
     * 如果toStart的值为true，则向开始位置闭合， 反之，向结束位置闭合。
     * @method  collapse
     * @param { Boolean } toStart 是否向选区开始处闭合
     * @return { UE.dom.Range } 当前range对象，此时range对象处于闭合状态
     * @see UE.dom.Range:collapse()
     * @example
     * ```html
     * <!-- 选区示例 -->
     * <b>xx<i>xxx</i><span>[xx]x</span>xxx</b>
     *
     * <script>
     *
     *     //执行操作
     *     range.collapse( true );
     *
     *     //结果选区
     *     //“|”表示选区已闭合
     *     //<b>xx<i>xxx</i><span>|xxx</span>xxx</b>
     *
     * </script>
     * ```
     */
    collapse:function (toStart) {
        var me = this;
        if (toStart) {
            me.endContainer = me.startContainer;
            me.endOffset = me.startOffset;
        } else {
            me.startContainer = me.endContainer;
            me.startOffset = me.endOffset;
        }
        me.collapsed = true;
        return me;
    },
};



var JUtils = JT.JUtils = {
    /**
     * 创建延迟指定时间后执行的函数fn
     * @method defer
     * @param { Function } fn 需要延迟执行的函数对象
     * @param { int } delay 延迟的时间， 单位是毫秒
     * @warning 该方法的时间控制是不精确的，仅仅只能保证函数的执行是在给定的时间之后，
     *           而不能保证刚好到达延迟时间时执行。
     * @return { Function } 目标函数fn的代理函数， 只有执行该函数才能起到延时效果
     * @example
     * ```javascript
     * var start = 0;
     *
     * function test(){
     *     console.log( new Date() - start );
     * }
     *
     * var testDefer = UE.utils.defer( test, 1000 );
     * //
     * start = new Date();
     * //output: (大约在1000毫秒之后输出) 1000
     * testDefer();
     * ```
     */

    /**
     * 创建延迟指定时间后执行的函数fn, 如果在延迟时间内再次执行该方法， 将会根据指定的exclusion的值，
     * 决定是否取消前一次函数的执行， 如果exclusion的值为true， 则取消执行，反之，将继续执行前一个方法。
     * @method defer
     * @param { Function } fn 需要延迟执行的函数对象
     * @param { int } delay 延迟的时间， 单位是毫秒
     * @param { Boolean } exclusion 如果在延迟时间内再次执行该函数，该值将决定是否取消执行前一次函数的执行，
     *                     值为true表示取消执行， 反之则将在执行前一次函数之后才执行本次函数调用。
     * @warning 该方法的时间控制是不精确的，仅仅只能保证函数的执行是在给定的时间之后，
     *           而不能保证刚好到达延迟时间时执行。
     * @return { Function } 目标函数fn的代理函数， 只有执行该函数才能起到延时效果
     * @example
     * ```javascript
     *
     * function test(){
     *     console.log(1);
     * }
     *
     * var testDefer = UE.utils.defer( test, 1000, true );
     *
     * //output: (两次调用仅有一次输出) 1
     * testDefer();
     * testDefer();
     * ```
     */
    defer:function (fn, delay, exclusion) {
        var timerID;
        return function () {
            if (exclusion) {
                clearTimeout(timerID);
            }
            timerID = setTimeout(fn, delay);
        };
    },
    // /**
    //  * 设置节点node及其子节点不会被选中
    //  * @method unSelectable
    //  * @param { Element } node 需要执行操作的dom元素
    //  * @remind 执行该操作后的节点， 将不能被鼠标选中
    //  * @example
    //  * ```javascript
    //  * UE.dom.domUtils.unSelectable( document.body );
    //  * ```
    //  */
    unSelectable: function (node) {
        node.style.MozUserSelect =
            node.style.webkitUserSelect =
                node.style.msUserSelect =
                    node.style.KhtmlUserSelect = 'none';
    },
    /**
     * 原生方法getElementsByTagName的封装
     * @method getElementsByTagName
     * @param { Node } node 目标节点对象
     * @param { String } tagName 需要查找的节点的tagName， 多个tagName以空格分割
     * @return { Array } 符合条件的节点集合
     */
    getElementsByTagName:function (node, name,filter) {
        if(filter && JUtils.isString(filter)){
            var className = filter;
            filter =  function(node){return domUtils.hasClass(node,className)}
        }
        name = JUtils.trim(name).replace(/[ ]{2,}/g,' ').split(' ');
        var arr = [];
        for(var n = 0,ni;ni=name[n++];){
            var list = node.getElementsByTagName(ni);
            for (var i = 0, ci; ci = list[i++];) {
                if(!filter || filter(ci))
                    arr.push(ci);
            }
        }

        return arr;
    },
    /**
     * 查找node的节点名为tagName的第一个祖先节点， 查找的起点是node节点的父节点。
     * @method findParentByTagName
     * @param { Node } node 需要查找的节点对象
     * @param { Array } tagNames 需要查找的父节点的名称数组
     * @warning 查找的终点是到body节点为止
     * @return { Node | NULL } 如果找到符合条件的节点， 则返回该节点， 否则返回NULL
     * @example
     * ```javascript
     * var node = UE.dom.domUtils.findParentByTagName( document.getElementsByTagName("div")[0], [ "BODY" ] );
     * //output: BODY
     * console.log( node.tagName );
     * ```
     */

    /**
     * 查找node的节点名为tagName的祖先节点， 如果includeSelf的值为true，则查找的起点是给定的节点node，
     * 否则， 起点是node的父节点。
     * @method findParentByTagName
     * @param { Node } node 需要查找的节点对象
     * @param { Array } tagNames 需要查找的父节点的名称数组
     * @param { Boolean } includeSelf 查找过程是否包含node节点自身
     * @warning 查找的终点是到body节点为止
     * @return { Node | NULL } 如果找到符合条件的节点， 则返回该节点， 否则返回NULL
     * @example
     * ```javascript
     * var queryTarget = document.getElementsByTagName("div")[0];
     * var node = UE.dom.domUtils.findParentByTagName( queryTarget, [ "DIV" ], true );
     * //output: true
     * console.log( queryTarget === node );
     * ```
     */
    findParentByTagName:function (node, tagNames, includeSelf, excludeFn) {
        tagNames = JUtils.listToMap(JUtils.isArray(tagNames) ? tagNames : [tagNames]);
        return JUtils.findParent(node, function (node) {
            return tagNames[node.tagName] && !(excludeFn && excludeFn(node));
        }, includeSelf);
    },
    /**
     * 获取节点A相对于节点B的位置关系
     * @method getPosition
     * @param { Node } nodeA 需要查询位置关系的节点A
     * @param { Node } nodeB 需要查询位置关系的节点B
     * @return { Number } 节点A与节点B的关系
     * @example
     * ```javascript
     * //output: 20
     * var position = UE.dom.domUtils.getPosition( document.documentElement, document.body );
     *
     * switch ( position ) {
     *
     *      //0
     *      case UE.dom.domUtils.POSITION_IDENTICAL:
     *          console.log('元素相同');
     *          break;
     *      //1
     *      case UE.dom.domUtils.POSITION_DISCONNECTED:
     *          console.log('两个节点在不同的文档中');
     *          break;
     *      //2
     *      case UE.dom.domUtils.POSITION_FOLLOWING:
     *          console.log('节点A在节点B之后');
     *          break;
     *      //4
     *      case UE.dom.domUtils.POSITION_PRECEDING;
     *          console.log('节点A在节点B之前');
     *          break;
     *      //8
     *      case UE.dom.domUtils.POSITION_IS_CONTAINED:
     *          console.log('节点A被节点B包含');
     *          break;
     *      case 10:
     *          console.log('节点A被节点B包含且节点A在节点B之后');
     *          break;
     *      //16
     *      case UE.dom.domUtils.POSITION_CONTAINS:
     *          console.log('节点A包含节点B');
     *          break;
     *      case 20:
     *          console.log('节点A包含节点B且节点A在节点B之前');
     *          break;
     *
     * }
     * ```
     */
    getPosition:function (nodeA, nodeB) {
        // 如果两个节点是同一个节点
        if (nodeA === nodeB) {
            // domUtils.POSITION_IDENTICAL
            return 0;
        }
        var node,
            parentsA = [nodeA],
            parentsB = [nodeB];
        node = nodeA;
        while (node = node.parentNode) {
            // 如果nodeB是nodeA的祖先节点
            if (node === nodeB) {
                // domUtils.POSITION_IS_CONTAINED + domUtils.POSITION_FOLLOWING
                return 10;
            }
            parentsA.push(node);
        }
        node = nodeB;
        while (node = node.parentNode) {
            // 如果nodeA是nodeB的祖先节点
            if (node === nodeA) {
                // domUtils.POSITION_CONTAINS + domUtils.POSITION_PRECEDING
                return 20;
            }
            parentsB.push(node);
        }
        parentsA.reverse();
        parentsB.reverse();
        if (parentsA[0] !== parentsB[0]) {
            // domUtils.POSITION_DISCONNECTED
            return 1;
        }
        var i = -1;
        while (i++, parentsA[i] === parentsB[i]) {
        }
        nodeA = parentsA[i];
        nodeB = parentsB[i];
        while (nodeA = nodeA.nextSibling) {
            if (nodeA === nodeB) {
                // domUtils.POSITION_PRECEDING
                return 4
            }
        }
        // domUtils.POSITION_FOLLOWING
        return  2;
    },
    /**
     * 检测节点node是否在给定的document对象上
     * @method inDoc
     * @param { Node } node 需要检测的节点对象
     * @param { DomDocument } doc 需要检测的document对象
     * @return { Boolean } 该节点node是否在给定的document的dom树上
     * @example
     * ```javascript
     *
     * var node = document.createElement("div");
     *
     * //output: false
     * console.log( UE.do.domUtils.inDoc( node, document ) );
     *
     * document.body.appendChild( node );
     *
     * //output: true
     * console.log( UE.do.domUtils.inDoc( node, document ) );
     *
     * ```
     */
    inDoc:function (node, doc) {
        //return JUtils.getPosition(node, doc) == 10;
        return true;
    },
    /**
     * 检测node节点是否为body节点
     * @method isBody
     * @param { Element } node 需要检测的dom元素
     * @return { Boolean } 给定的元素是否是body元素
     * @example
     * ```javascript
     * //output: true
     * console.log( UE.dom.JUtils.isBody( document.body ) );
     * ```
     */
    isBody:function (node) {
        return  node && node.nodeType == 1 && node.tagName.toLowerCase() == 'body';
    },
    /**
     * 根据给定的过滤规则filterFn， 查找符合该过滤规则的node节点的第一个祖先节点，
     * 查找的起点是给定node节点的父节点。
     * @method findParent
     * @param { Node } node 需要查找的节点
     * @param { Function } filterFn 自定义的过滤方法。
     * @warning 查找的终点是到body节点为止
     * @remind 自定义的过滤方法filterFn接受一个Node对象作为参数， 该对象代表当前执行检测的祖先节点。 如果该
     *          节点满足过滤条件， 则要求返回true， 这时将直接返回该节点作为findParent()的结果， 否则， 请返回false。
     * @return { Node | Null } 如果找到符合过滤条件的节点， 就返回该节点， 否则返回NULL
     * @example
     * ```javascript
     * var filterNode = UE.dom.JUtils.findParent( document.body.firstChild, function ( node ) {
     *
     *     //由于查找的终点是body节点， 所以永远也不会匹配当前过滤器的条件， 即这里永远会返回false
     *     return node.tagName === "HTML";
     *
     * } );
     *
     * //output: true
     * console.log( filterNode === null );
     * ```
     */

    /**
     * 根据给定的过滤规则filterFn， 查找符合该过滤规则的node节点的第一个祖先节点，
     * 如果includeSelf的值为true，则查找的起点是给定的节点node， 否则， 起点是node的父节点
     * @method findParent
     * @param { Node } node 需要查找的节点
     * @param { Function } filterFn 自定义的过滤方法。
     * @param { Boolean } includeSelf 查找过程是否包含自身
     * @warning 查找的终点是到body节点为止
     * @remind 自定义的过滤方法filterFn接受一个Node对象作为参数， 该对象代表当前执行检测的祖先节点。 如果该
     *          节点满足过滤条件， 则要求返回true， 这时将直接返回该节点作为findParent()的结果， 否则， 请返回false。
     * @remind 如果includeSelf为true， 则过滤器第一次执行时的参数会是节点本身。
     *          反之， 过滤器第一次执行时的参数将是该节点的父节点。
     * @return { Node | Null } 如果找到符合过滤条件的节点， 就返回该节点， 否则返回NULL
     * @example
     * ```html
     * <body>
     *
     *      <div id="test">
     *      </div>
     *
     *      <script type="text/javascript">
     *
     *          //output: DIV, BODY
     *          var filterNode = UE.dom.JUtils.findParent( document.getElementById( "test" ), function ( node ) {
     *
     *              console.log( node.tagName );
     *              return false;
     *
     *          }, true );
     *
     *      </script>
     * </body>
     * ```
     */
    findParent:function (node, filterFn, includeSelf) {
        if (node && !JUtils.isBody(node)) {
            node = includeSelf ? node : node.parentNode;
            while (node) {
                if (!filterFn || filterFn(node) || JUtils.isBody(node)) {
                    return filterFn && !filterFn(node) && JUtils.isBody(node) ? null : node;
                }
                node = node.parentNode;
            }
        }
        return null;
    },
    /**
     * 将字符串str以','分隔成数组后，将该数组转换成哈希对象， 其生成的hash对象的key为数组中的元素， value为1
     * @method listToMap
     * @warning 该方法在生成的hash对象中，会为每一个key同时生成一个另一个全大写的key。
     * @param { String } str 该字符串将被以','分割为数组， 然后进行转化
     * @return { Object } 转化之后的hash对象
     * @example
     * ```javascript
     *
     * //output: Object {UEdtior: 1, UEDTIOR: 1, Hello: 1, HELLO: 1}
     * console.log( UE.utils.listToMap( 'UEdtior,Hello' ) );
     *
     * ```
     */

    /**
     * 将字符串数组转换成哈希对象， 其生成的hash对象的key为数组中的元素， value为1
     * @method listToMap
     * @warning 该方法在生成的hash对象中，会为每一个key同时生成一个另一个全大写的key。
     * @param { Array } arr 字符串数组
     * @return { Object } 转化之后的hash对象
     * @example
     * ```javascript
     *
     * //output: Object {UEdtior: 1, UEDTIOR: 1, Hello: 1, HELLO: 1}
     * console.log( UE.utils.listToMap( [ 'UEdtior', 'Hello' ] ) );
     *
     * ```
     */
    listToMap:function (list) {
        if (!list)return {};
        list = list.constructor == Array ? list : list.split(',');
        for (var i = 0, ci, obj = {}; ci = list[i++];) {
            obj[ci.toUpperCase()] = obj[ci] = 1;
        }
        return obj;
    },
    /**
     * 检测节点node在父节点中的索引位置
     * @method getNodeIndex
     * @param { Node } node 需要检测的节点对象
     * @return { Number } 该节点在父节点中的位置
     * @see UE.dom.JUtils.getNodeIndex(Node,Boolean)
     */

    /**
     * 检测节点node在父节点中的索引位置， 根据给定的mergeTextNode参数决定是否要合并多个连续的文本节点为一个节点
     * @method getNodeIndex
     * @param { Node } node 需要检测的节点对象
     * @param { Boolean } mergeTextNode 是否合并多个连续的文本节点为一个节点
     * @return { Number } 该节点在父节点中的位置
     * @example
     * ```javascript
     *
     *      var node = document.createElement("div");
     *
     *      node.appendChild( document.createTextNode( "hello" ) );
     *      node.appendChild( document.createTextNode( "world" ) );
     *      node.appendChild( node = document.createElement( "div" ) );
     *
     *      //output: 2
     *      console.log( UE.dom.JUtils.getNodeIndex( node ) );
     *
     *      //output: 1
     *      console.log( UE.dom.JUtils.getNodeIndex( node, true ) );
     *
     * ```
     */
    getNodeIndex:function (node, ignoreTextNode) {
        var preNode = node,
            i = 0;
        while (preNode = preNode.previousSibling) {
            if (ignoreTextNode && preNode.nodeType == 3) {
                if(preNode.nodeType != preNode.nextSibling.nodeType ){
                    i++;
                }
                continue;
            }
            i++;
        }
        return i;
    },
    /**
     * 获取元素element相对于viewport的位置坐标
     * @method getXY
     * @param { Node } element 需要计算位置的节点对象
     * @return { Object } 返回形如{x:left,y:top}的一个key-value映射对象， 其中键x代表水平偏移距离，
     *                          y代表垂直偏移距离。
     *
     * @example
     * ```javascript
     * var location = UE.dom.JUtils.getXY( document.getElementById("test") );
     * //output: test的坐标为: 12, 24
     * console.log( 'test的坐标为： ', location.x, ',', location.y );
     * ```
     */
    getXY:function (element) {
        var x = 0, y = 0;
        while (element.offsetParent) {
            y += element.offsetTop;
            x += element.offsetLeft;
            element = element.offsetParent;
        }
        return { 'x':x, 'y':y};
    },
    /**
     * 为元素element绑定原生DOM事件，type为事件类型，handler为处理函数
     * @method on
     * @param { Node } element 需要绑定事件的节点对象
     * @param { String } type 绑定的事件类型
     * @param { Function } handler 事件处理器
     * @example
     * ```javascript
     * UE.dom.JUtils.on(document.body,"click",function(e){
     *     //e为事件对象，this为被点击元素对戏那个
     * });
     * ```
     */

    /**
     * 为元素element绑定原生DOM事件，type为事件类型，handler为处理函数
     * @method on
     * @param { Node } element 需要绑定事件的节点对象
     * @param { Array } type 绑定的事件类型数组
     * @param { Function } handler 事件处理器
     * @example
     * ```javascript
     * UE.dom.JUtils.on(document.body,["click","mousedown"],function(evt){
     *     //evt为事件对象，this为被点击元素对象
     * });
     * ```
     */
    on:function (element, type, handler) {
        var types = JUtils.isArray(type) ? type : JUtils.trim(type).split(/\s+/),
            k = types.length;
        if (k) while (k--) {
            type = types[k];
            console.log(type);
            if (element.addEventListener) {
                element.addEventListener(type, handler, false);
            } else {
                if (!handler._d) {
                    handler._d = {
                        els : []
                    };
                }
                var key = type + handler.toString(),index = JUtils.indexOf(handler._d.els,element);
                if (!handler._d[key] || index == -1) {
                    if(index == -1){
                        handler._d.els.push(element);
                    }
                    if(!handler._d[key]){
                        handler._d[key] = function (evt) {
                            return handler.call(evt.srcElement, evt || window.event);
                        };
                    }


                    element.attachEvent('on' + type, handler._d[key]);
                }
            }
        }
        element = null;
    },
    /**
     * 解除DOM事件绑定
     * @method un
     * @param { Node } element 需要解除事件绑定的节点对象
     * @param { String } type 需要接触绑定的事件类型
     * @param { Function } handler 对应的事件处理器
     * @example
     * ```javascript
     * UE.dom.JUtils.un(document.body,"click",function(evt){
     *     //evt为事件对象，this为被点击元素对象
     * });
     * ```
     */

    /**
     * 解除DOM事件绑定
     * @method un
     * @param { Node } element 需要解除事件绑定的节点对象
     * @param { Array } type 需要接触绑定的事件类型数组
     * @param { Function } handler 对应的事件处理器
     * @example
     * ```javascript
     * UE.dom.JUtils.un(document.body, ["click","mousedown"],function(evt){
     *     //evt为事件对象，this为被点击元素对象
     * });
     * ```
     */
    un:function (element, type, handler) {
        var types = JUtils.isArray(type) ? type : JUtils.trim(type).split(/\s+/),
            k = types.length;
        if (k) while (k--) {
            type = types[k];
            if (element.removeEventListener) {
                element.removeEventListener(type, handler, false);
            } else {
                var key = type + handler.toString();
                try{
                    element.detachEvent('on' + type, handler._d ? handler._d[key] : handler);
                }catch(e){}
                if (handler._d && handler._d[key]) {
                    var index = JUtils.indexOf(handler._d.els,element);
                    if(index!=-1){
                        handler._d.els.splice(index,1);
                    }
                    handler._d.els.length == 0 && delete handler._d[key];
                }
            }
        }
    },
    /**
     * 用给定的迭代器遍历对象
     * @method each
     * @param { Object } obj 需要遍历的对象
     * @param { Function } iterator 迭代器， 该方法接受两个参数， 第一个参数是当前所处理的value， 第二个参数是当前遍历对象的key
     * @example
     * ```javascript
     * var demoObj = {
     *     key1: 1,
     *     key2: 2
     * };
     *
     * //output: key1: 1, key2: 2
     * UE.JUtils.each( demoObj, funciton ( value, key ) {
     *
     *     console.log( key + ":" + value );
     *
     * } );
     * ```
     */

    /**
     * 用给定的迭代器遍历数组或类数组对象
     * @method each
     * @param { Array } array 需要遍历的数组或者类数组
     * @param { Function } iterator 迭代器， 该方法接受两个参数， 第一个参数是当前所处理的value， 第二个参数是当前遍历对象的key
     * @example
     * ```javascript
     * var divs = document.getElmentByTagNames( "div" );
     *
     * //output: 0: DIV, 1: DIV ...
     * UE.JUtils.each( divs, funciton ( value, key ) {
     *
     *     console.log( key + ":" + value.tagName );
     *
     * } );
     * ```
     */
    each : function(obj, iterator, context) {
        if (obj == null) return;
        if (obj.length === +obj.length) {
            for (var i = 0, l = obj.length; i < l; i++) {
                if(iterator.call(context, obj[i], i, obj) === false)
                    return false;
            }
        } else {
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if(iterator.call(context, obj[key], key, obj) === false)
                        return false;
                }
            }
        }
    },
    /**
     * 查找node的节点名为tagName的第一个祖先节点， 查找的起点是node节点的父节点。
     * @method findParentByTagName
     * @param { Node } node 需要查找的节点对象
     * @param { Array } tagNames 需要查找的父节点的名称数组
     * @warning 查找的终点是到body节点为止
     * @return { Node | NULL } 如果找到符合条件的节点， 则返回该节点， 否则返回NULL
     * @example
     * ```javascript
     * var node = UE.dom.JUtils.findParentByTagName( document.getElementsByTagName("div")[0], [ "BODY" ] );
     * //output: BODY
     * console.log( node.tagName );
     * ```
     */

    /**
     * 查找node的节点名为tagName的祖先节点， 如果includeSelf的值为true，则查找的起点是给定的节点node，
     * 否则， 起点是node的父节点。
     * @method findParentByTagName
     * @param { Node } node 需要查找的节点对象
     * @param { Array } tagNames 需要查找的父节点的名称数组
     * @param { Boolean } includeSelf 查找过程是否包含node节点自身
     * @warning 查找的终点是到body节点为止
     * @return { Node | NULL } 如果找到符合条件的节点， 则返回该节点， 否则返回NULL
     * @example
     * ```javascript
     * var queryTarget = document.getElementsByTagName("div")[0];
     * var node = UE.dom.JUtils.findParentByTagName( queryTarget, [ "DIV" ], true );
     * //output: true
     * console.log( queryTarget === node );
     * ```
     */
    findParentByTagName:function (node, tagNames, includeSelf, excludeFn) {
        tagNames = JUtils.listToMap(JUtils.isArray(tagNames) ? tagNames : [tagNames]);
        return JUtils.findParent(node, function (node) {
            return tagNames[node.tagName] && !(excludeFn && excludeFn(node));
        }, includeSelf);
    },
    /**
     * 以给定对象作为原型创建一个新对象
     * @method makeInstance
     * @param { Object } protoObject 该对象将作为新创建对象的原型
     * @return { Object } 新的对象， 该对象的原型是给定的protoObject对象
     * @example
     * ```javascript
     *
     * var protoObject = { sayHello: function () { console.log('Hello UEditor!'); } };
     *
     * var newObject = UE.JUtils.makeInstance( protoObject );
     * //output: Hello UEditor!
     * newObject.sayHello();
     * ```
     */
    makeInstance:function (obj) {
        var noop = new Function();
        noop.prototype = obj;
        obj = new noop;
        noop.prototype = null;
        return obj;
    },
    /**
     * 模拟继承机制， 使得subClass继承自superClass
     * @method inherits
     * @param { Object } subClass 子类对象
     * @param { Object } superClass 超类对象
     * @warning 该方法只能让subClass继承超类的原型， subClass对象自身的属性和方法不会被继承
     * @return { Object } 继承superClass后的子类对象
     * @example
     * ```javascript
     * function SuperClass(){
     *     this.name = "小李";
     * }
     *
     * SuperClass.prototype = {
     *     hello:function(str){
     *         console.log(this.name + str);
     *     }
     * }
     *
     * function SubClass(){
     *     this.name = "小张";
     * }
     *
     * UE.JUtils.inherits(SubClass,SuperClass);
     *
     * var sub = new SubClass();
     * //output: '小张早上好!
     * sub.hello("早上好!");
     * ```
     */
    inherits:function (subClass, superClass) {
        var oldP = subClass.prototype,
            newP = JUtils.makeInstance(superClass.prototype);
        JUtils.extend(newP, oldP, true);
        subClass.prototype = newP;
        return (newP.constructor = subClass);
    },
    /**
     * 将source对象中的属性扩展到target对象上， 根据指定的isKeepTarget值决定是否保留目标对象中与
     * 源对象属性名相同的属性值。
     * @method extend
     * @param { Object } target 目标对象， 新的属性将附加到该对象上
     * @param { Object } source 源对象， 该对象的属性会被附加到target对象上
     * @param { Boolean } isKeepTarget 是否保留目标对象中与源对象中属性名相同的属性
     * @return { Object } 返回target对象
     * @example
     * ```javascript
     *
     * var target = { name: 'target', sex: 1 },
     *      source = { name: 'source', age: 17 };
     *
     * UE.JUtils.extend( target, source, true );
     *
     * //output: { name: 'target', sex: 1, age: 17 }
     * console.log( target );
     *
     * ```
     */
    extend: function (t, s, b) {
        if (s) {
            for (var k in s) {
                if (!b || !t.hasOwnProperty(k)) {
                    t[k] = s[k];
                }
            }
        }
        return t;
    },
    /**
     * 克隆对象
     * @method clone
     * @param { Object } source 源对象
     * @return { Object } source的一个副本
     */

    /**
     * 深度克隆对象，将source的属性克隆到target对象， 会覆盖target重名的属性。
     * @method clone
     * @param { Object } source 源对象
     * @param { Object } target 目标对象
     * @return { Object } 附加了source对象所有属性的target对象
     */
    clone: function (source, target) {
        var tmp;
        target = target || {};
        for (var i in source) {
            if (source.hasOwnProperty(i)) {
                tmp = source[i];
                if (typeof tmp == 'object') {
                    target[i] = JUtils.isArray(tmp) ? [] : {};
                    JUtils.clone(source[i], target[i])
                } else {
                    target[i] = tmp;
                }
            }
        }
        return target;
    },
    /**
     * 移除数组array中所有的元素item
     * @method removeItem
     * @param { Array } array 要移除元素的目标数组
     * @param { * } item 将要被移除的元素
     * @remind 该方法的匹配过程使用的是恒等“===”
     * @example
     * ```javascript
     * var arr = [ 4, 5, 7, 1, 3, 4, 6 ];
     *
     * UE.JUtils.removeItem( arr, 4 );
     * //output: [ 5, 7, 1, 3, 6 ]
     * console.log( arr );
     *
     * ```
     */
    removeItem:function (array, item) {
        for (var i = 0, l = array.length; i < l; i++) {
            if (array[i] === item) {
                array.splice(i, 1);
                i--;
            }
        }
    },
    /**
     * 删除节点node及其下属的所有节点
     * @method remove
     * @param { Node } node 需要删除的节点对象
     * @return { Node } 返回刚删除的节点对象
     * @example
     * ```html
     * <div id="test">
     *     <div id="child">你好</div>
     * </div>
     * <script>
     *     UE.dom.JUtils.remove( document.body, false );
     *     //output: false
     *     console.log( document.getElementById( "child" ) !== null );
     * </script>
     * ```
     */

    /**
     * 删除节点node，并根据keepChildren的值决定是否保留子节点
     * @method remove
     * @param { Node } node 需要删除的节点对象
     * @param { Boolean } keepChildren 是否需要保留子节点
     * @return { Node } 返回刚删除的节点对象
     * @example
     * ```html
     * <div id="test">
     *     <div id="child">你好</div>
     * </div>
     * <script>
     *     UE.dom.JUtils.remove( document.body, true );
     *     //output: true
     *     console.log( document.getElementById( "child" ) !== null );
     * </script>
     * ```
     */
    remove: function (node, keepChildren) {
        var parent = node.parentNode,
            child;
        if (parent) {
            if (keepChildren && node.hasChildNodes()) {
                while (child = node.firstChild) {
                    parent.insertBefore(child, node);
                }
            }
            parent.removeChild(node);
        }
        return node;
    },
    /**
     * 获取元素element经过计算后的样式值
     * @method getComputedStyle
     * @param { Element } element 需要获取样式的元素对象
     * @param { String } styleName 需要获取的样式名
     * @return { String } 获取到的样式值
     * @example
     * ```html
     * <style type="text/css">
     *      #test {
     *          font-size: 15px;
     *      }
     * </style>
     *
     * <span id="test"></span>
     *
     * <script>
     *     //output: 15px
     *     console.log( UE.dom.JUtils.getComputedStyle( document.getElementById( "test" ), 'font-size' ) );
     * </script>
     * ```
     */
    getComputedStyle: function (element, styleName) {
        //以下的属性单独处理
        var pros = 'width height top left';

        if (pros.indexOf(styleName) > -1) {
            return element['offset' + styleName.replace(/^\w/, function (s) {
                    return s.toUpperCase()
                })] + 'px';
        }
        //忽略文本节点
        if (element.nodeType == 3) {
            element = element.parentNode;
        }
        //ie下font-size若body下定义了font-size，则从currentStyle里会取到这个font-size. 取不到实际值，故此修改.
        if (browser.ie && browser.version < 9 && styleName == 'font-size' && !element.style.fontSize && !dtd.$empty[element.tagName] && !dtd.$nonChild[element.tagName]) {
            var span = element.ownerDocument.createElement('span');
            span.style.cssText = 'padding:0;border:0;font-family:simsun;';
            span.innerHTML = '.';
            element.appendChild(span);
            var result = span.offsetHeight;
            element.removeChild(span);
            span = null;
            return result + 'px';
        }
        try {
            var value = JUtils.getStyle(element, styleName) ||
                (window.getComputedStyle ? JUtils.getWindow(element).getComputedStyle(element, '').getPropertyValue(styleName) :
                    ( element.currentStyle || element.style )[JUtils.cssStyleToDomStyle(styleName)]);

        } catch (e) {
            return "";
        }
        return JUtils.transUnitToPx(JUtils.fixColor(styleName, value));
    },
    /**
     * 获取元素element的style属性的指定值
     * @method getStyle
     * @param { Element } element 需要获取属性值的元素
     * @param { String } styleName 需要获取的style的名称
     * @warning 该方法仅获取元素style属性中所标明的值
     * @return { String } 该元素包含指定的style属性值
     * @example
     * ```html
     * <div id="test" style="color: red;"></div>
     *
     * <script>
     *
     *      var testNode = document.getElementById( "test" );
     *
     *      //output: red
     *      console.log( UE.dom.JUtils.getStyle( testNode, "color" ) );
     *
     *      //output: ""
     *      console.log( UE.dom.JUtils.getStyle( testNode, "background" ) );
     *
     * </script>
     * ```
     */
    getStyle: function (element, name) {
        var value = element.style[JUtils.cssStyleToDomStyle(name)];
        return JUtils.fixColor(name, value);
    },
    /**
     * 获取节点node所属的window对象
     * @method  getWindow
     * @param { Node } node 节点对象
     * @return { Window } 当前节点所属的window对象
     * @example
     * ```javascript
     * //output: true
     * console.log( UE.dom.JUtils.getWindow( document.body ) === window );
     * ```
     */
    getWindow: function (node) {
        var doc = node.ownerDocument || node;
        return doc.defaultView || doc.parentWindow;
    },
    /**
     * 将css样式转换为驼峰的形式
     * @method cssStyleToDomStyle
     * @param { String } cssName 需要转换的css样式名
     * @return { String } 转换成驼峰形式后的css样式名
     * @example
     * ```javascript
     *
     * var str = 'border-top';
     *
     * //output: borderTop
     * console.log( UE.JUtils.cssStyleToDomStyle( str ) );
     *
     * ```
     */
    cssStyleToDomStyle: function () {
        var test = document.createElement('div').style,
            cache = {
                'float': test.cssFloat != undefined ? 'cssFloat' : test.styleFloat != undefined ? 'styleFloat' : 'float'
            };

        return function (cssName) {
            return cache[cssName] || (cache[cssName] = cssName.toLowerCase().replace(/-./g, function (match) {
                    return match.charAt(1).toUpperCase();
                }));
        };
    }(),
    /**
     * 把cm／pt为单位的值转换为px为单位的值
     * @method transUnitToPx
     * @param { String } 待转换的带单位的字符串
     * @return { String } 转换为px为计量单位的值的字符串
     * @example
     * ```javascript
     *
     * //output: 500px
     * console.log( UE.JUtils.transUnitToPx( '20cm' ) );
     *
     * //output: 27px
     * console.log( UE.JUtils.transUnitToPx( '20pt' ) );
     *
     * ```
     */
    transUnitToPx: function (val) {
        if (!/(pt|cm)/.test(val)) {
            return val
        }
        var unit;
        val.replace(/([\d.]+)(\w+)/, function (str, v, u) {
            val = v;
            unit = u;
        });
        switch (unit) {
            case 'cm':
                val = parseFloat(val) * 25;
                break;
            case 'pt':
                val = Math.round(parseFloat(val) * 96 / 72);
        }
        return val + (val ? 'px' : '');
    },
    /**
     * 把rgb格式的颜色值转换成16进制格式
     * @method fixColor
     * @param { String } rgb格式的颜色值
     * @param { String }
     * @example
     * rgb(255,255,255)  => "#ffffff"
     */
    fixColor: function (name, value) {
        if (/color/i.test(name) && /rgba?/.test(value)) {
            var array = value.split(",");
            if (array.length > 3)
                return "";
            value = "#";
            for (var i = 0, color; color = array[i++];) {
                color = parseInt(color.replace(/[^\d]/gi, ''), 10).toString(16);
                value += color.length == 1 ? "0" + color : color;
            }
            value = value.toUpperCase();
        }
        return value;
    },
    /**
     * 删除字符串str的首尾空格
     * @method trim
     * @param { String } str 需要删除首尾空格的字符串
     * @return { String } 删除了首尾的空格后的字符串
     * @example
     * ```javascript
     *
     * var str = " UEdtior ";
     *
     * //output: 9
     * console.log( str.length );
     *
     * //output: 7
     * console.log( UE.JUtils.trim( " UEdtior " ).length );
     *
     * //output: 9
     * console.log( str.length );
     *
     *  ```
     */
    trim:function (str) {
        return str.replace(/(^[ \t\n\r]+)|([ \t\n\r]+$)/g, '');
    },
    /**
     * 动态添加css样式
     * @method cssRule
     * @param { String } 节点名称
     * @grammar UE.JUtils.cssRule('添加的样式的节点名称',['样式'，'放到哪个document上'])
     * @grammar UE.JUtils.cssRule('body','body{background:#ccc}') => null  //给body添加背景颜色
     * @grammar UE.JUtils.cssRule('body') =>样式的字符串  //取得key值为body的样式的内容,如果没有找到key值先关的样式将返回空，例如刚才那个背景颜色，将返回 body{background:#ccc}
     * @grammar UE.JUtils.cssRule('body',document) => 返回指定key的样式，并且指定是哪个document
     * @grammar UE.JUtils.cssRule('body','') =>null //清空给定的key值的背景颜色
     */
    cssRule:function (key, style, doc) {
        var head, node;
        if(style === undefined || style && style.nodeType && style.nodeType == 9){
            //获取样式
            doc = style && style.nodeType && style.nodeType == 9 ? style : (doc || document);
            node = doc.getElementById(key);
            return node ? node.innerHTML : undefined;
        }
        doc = doc || document;
        node = doc.getElementById(key);

        //清除样式
        if(style === ''){
            if(node){
                node.parentNode.removeChild(node);
                return true
            }
            return false;
        }
        var styleDom = doc.createElement('style');
        styleDom.id = key;
        styleDom.innerHTML = style;
        doc.head.appendChild(styleDom);
    },
};

JUtils.each(['String', 'Function', 'Array', 'Number', 'RegExp', 'Object', 'Date'], function (v) {
    JT.JUtils['is' + v] = function (obj) {
        return Object.prototype.toString.apply(obj) == '[object ' + v + ']';
    }
});

/**
 * 浏览器判断模块
 * @file
 * @module JT.browser
 * @since 1.0.0.0
 */

/**
 * 提供浏览器检测的模块
 * @unfile
 * @module JT.browser
 */
var browser = JT.browser = function () {
    var agent = navigator.userAgent.toLowerCase(),
        opera = window.opera,
        browser = {
            /**
             * @property {boolean} ie 检测当前浏览器是否为IE
             * @example
             * ```javascript
             * if ( UE.browser.ie ) {
         *     console.log( '当前浏览器是IE' );
         * }
             * ```
             */
            ie: /(msie\s|trident.*rv:)([\w.]+)/.test(agent),

            /**
             * @property {boolean} opera 检测当前浏览器是否为Opera
             * @example
             * ```javascript
             * if ( JT.browser.opera ) {
         *     console.log( '当前浏览器是Opera' );
         * }
             * ```
             */
            opera: ( !!opera && opera.version ),

            /**
             * @property {boolean} webkit 检测当前浏览器是否是webkit内核的浏览器
             * @example
             * ```javascript
             * if ( JT.browser.webkit ) {
         *     console.log( '当前浏览器是webkit内核浏览器' );
         * }
             * ```
             */
            webkit: ( agent.indexOf(' applewebkit/') > -1 ),

            /**
             * @property {boolean} mac 检测当前浏览器是否是运行在mac平台下
             * @example
             * ```javascript
             * if ( JT.browser.mac ) {
         *     console.log( '当前浏览器运行在mac平台下' );
         * }
             * ```
             */
            mac: ( agent.indexOf('macintosh') > -1 ),

            /**
             * @property {boolean} quirks 检测当前浏览器是否处于“怪异模式”下
             * @example
             * ```javascript
             * if ( JT.browser.quirks ) {
         *     console.log( '当前浏览器运行处于“怪异模式”' );
         * }
             * ```
             */
            quirks: ( document.compatMode == 'BackCompat' )
        };

    /**
     * @property {boolean} gecko 检测当前浏览器内核是否是gecko内核
     * @example
     * ```javascript
     * if ( JT.browser.gecko ) {
    *     console.log( '当前浏览器内核是gecko内核' );
    * }
     * ```
     */
    browser.gecko = ( navigator.product == 'Gecko' && !browser.webkit && !browser.opera && !browser.ie);

    var version = 0;

    // Internet Explorer 6.0+
    if (browser.ie) {

        var v1 = agent.match(/(?:msie\s([\w.]+))/);
        var v2 = agent.match(/(?:trident.*rv:([\w.]+))/);
        if (v1 && v2 && v1[1] && v2[1]) {
            version = Math.max(v1[1] * 1, v2[1] * 1);
        } else if (v1 && v1[1]) {
            version = v1[1] * 1;
        } else if (v2 && v2[1]) {
            version = v2[1] * 1;
        } else {
            version = 0;
        }

        browser.ie11Compat = document.documentMode == 11;
        /**
         * @property { boolean } ie9Compat 检测浏览器模式是否为 IE9 兼容模式
         * @warning 如果浏览器不是IE， 则该值为undefined
         * @example
         * ```javascript
         * if ( JT.browser.ie9Compat ) {
         *     console.log( '当前浏览器运行在IE9兼容模式下' );
         * }
         * ```
         */
        browser.ie9Compat = document.documentMode == 9;

        /**
         * @property { boolean } ie8 检测浏览器是否是IE8浏览器
         * @warning 如果浏览器不是IE， 则该值为undefined
         * @example
         * ```javascript
         * if ( JT.browser.ie8 ) {
         *     console.log( '当前浏览器是IE8浏览器' );
         * }
         * ```
         */
        browser.ie8 = !!document.documentMode;

        /**
         * @property { boolean } ie8Compat 检测浏览器模式是否为 IE8 兼容模式
         * @warning 如果浏览器不是IE， 则该值为undefined
         * @example
         * ```javascript
         * if ( JT.browser.ie8Compat ) {
         *     console.log( '当前浏览器运行在IE8兼容模式下' );
         * }
         * ```
         */
        browser.ie8Compat = document.documentMode == 8;

        /**
         * @property { boolean } ie7Compat 检测浏览器模式是否为 IE7 兼容模式
         * @warning 如果浏览器不是IE， 则该值为undefined
         * @example
         * ```javascript
         * if ( JT.browser.ie7Compat ) {
         *     console.log( '当前浏览器运行在IE7兼容模式下' );
         * }
         * ```
         */
        browser.ie7Compat = ( ( version == 7 && !document.documentMode )
        || document.documentMode == 7 );

        /**
         * @property { boolean } ie6Compat 检测浏览器模式是否为 IE6 模式 或者怪异模式
         * @warning 如果浏览器不是IE， 则该值为undefined
         * @example
         * ```javascript
         * if ( JT.browser.ie6Compat ) {
         *     console.log( '当前浏览器运行在IE6模式或者怪异模式下' );
         * }
         * ```
         */
        browser.ie6Compat = ( version < 7 || browser.quirks );

        browser.ie9above = version > 8;

        browser.ie9below = version < 9;

        browser.ie11above = version > 10;

        browser.ie11below = version < 11;

    }

    // Gecko.
    if (browser.gecko) {
        var geckoRelease = agent.match(/rv:([\d\.]+)/);
        if (geckoRelease) {
            geckoRelease = geckoRelease[1].split('.');
            version = geckoRelease[0] * 10000 + ( geckoRelease[1] || 0 ) * 100 + ( geckoRelease[2] || 0 ) * 1;
        }
    }

    /**
     * @property { Number } chrome 检测当前浏览器是否为Chrome, 如果是，则返回Chrome的大版本号
     * @warning 如果浏览器不是chrome， 则该值为undefined
     * @example
     * ```javascript
     * if ( JT.browser.chrome ) {
     *     console.log( '当前浏览器是Chrome' );
     * }
     * ```
     */
    if (/chrome\/(\d+\.\d)/i.test(agent)) {
        browser.chrome = +RegExp['\x241'];
    }

    /**
     * @property { Number } safari 检测当前浏览器是否为Safari, 如果是，则返回Safari的大版本号
     * @warning 如果浏览器不是safari， 则该值为undefined
     * @example
     * ```javascript
     * if ( JT.browser.safari ) {
     *     console.log( '当前浏览器是Safari' );
     * }
     * ```
     */
    if (/(\d+\.\d)?(?:\.\d)?\s+safari\/?(\d+\.\d+)?/i.test(agent) && !/chrome/i.test(agent)) {
        browser.safari = +(RegExp['\x241'] || RegExp['\x242']);
    }


    // Opera 9.50+
    if (browser.opera)
        version = parseFloat(opera.version());

    // WebKit 522+ (Safari 3+)
    if (browser.webkit)
        version = parseFloat(agent.match(/ applewebkit\/(\d+)/)[1]);

    /**
     * @property { Number } version 检测当前浏览器版本号
     * @remind
     * <ul>
     *     <li>IE系列返回值为5,6,7,8,9,10等</li>
     *     <li>gecko系列会返回10900，158900等</li>
     *     <li>webkit系列会返回其build号 (如 522等)</li>
     * </ul>
     * @example
     * ```javascript
     * console.log( '当前浏览器版本号是： ' + JT.browser.version );
     * ```
     */
    browser.version = version;

    /**
     * @property { boolean } isCompatible 检测当前浏览器是否能够与JTditor良好兼容
     * @example
     * ```javascript
     * if ( JT.browser.isCompatible ) {
     *     console.log( '浏览器与JTditor能够良好兼容' );
     * }weg
     * ```
     */
    browser.isCompatible =
        !browser.mobile && (
        ( browser.ie && version >= 6 ) ||
        ( browser.gecko && version >= 10801 ) ||
        ( browser.opera && version >= 9.5 ) ||
        ( browser.air && version >= 1 ) ||
        ( browser.webkit && version >= 522 ) ||
        false );
    return browser;
}();
//快捷方式
var ie = browser.ie,
    webkit = browser.webkit,
    gecko = browser.gecko,
    opera = browser.opera;
JUtils.inherits(JTable,JEventBase);
