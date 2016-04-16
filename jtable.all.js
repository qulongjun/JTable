/**
 * Created by qulongjun on 16/4/13.
 */
var JT = window.JT || {};
var JTABLE_CONFIG = Window.JTABLE_CONFIG || {};
Window.JT = JT;
JT.instants = {};
JT.commands = {};
JT.dom = {};

window.JTABLE_CONFIG = {
    container: ""//必需
    , tdWidth: "50"
    , tdHeight: "50"
    , tdvalign: "center"
    , defaultRows: 5
    , defaultCols: 5
    , tableWidth: 300
    , tableStyle: 'table{margin-bottom:10px;border-collapse:collapse;display:table;}' +
    'td,th{padding: 5px 10px;border: 1px solid #DDD;}' +
    'caption{border:1px dashed #DDD;border-bottom:0;padding:3px;text-align:center;}' +
    'th{border-top:1px solid #BBB;background-color:#F7F7F7;}' +
    'table tr.firstRow th{border-top-width:2px;}' +
    '.ue-table-interlace-color-single{ background-color: #fcfcfc; } .ue-table-interlace-color-double{ background-color: #f7faff; }' +
    'td p{margin:0;padding:0;}'
    , selectTableStyle: '.selectTdClass{background-color:#edf5fa !important}' +
    'table.noBorderTable td,table.noBorderTable th,table.noBorderTable caption{border:1px dashed #ddd !important}'

};
var uid = 0;
var attrFix = {
    tabindex: "tabIndex",
    readonly: "readOnly"
};
var JEventBase = JT.JEventBase = {};
JEventBase.prototype = {
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
    addListener: function (types, listener) {
        types = JUtils.trim(types).split(/\s+/);
        for (var i = 0, ti; ti = types[i++];) {
            getListener(this, ti, true).push(listener);
        }
    },

    on: function (types, listener) {
        return this.addListener(types, listener);
    },
    off: function (types, listener) {
        return this.removeListener(types, listener)
    },
    trigger: function () {
        return this.fireEvent.apply(this, arguments);
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
    removeListener: function (types, listener) {
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
    fireEvent: function () {
        var types = arguments[0];
        types = JUtils.trim(types).split(' ');
        for (var i = 0, ti; ti = types[i++];) {
            var listeners = getListener(this, ti),
                r, t, k;
            if (listeners) {
                k = listeners.length;
                while (k--) {
                    if (!listeners[k])continue;
                    t = listeners[k].apply(this, arguments);
                    if (t === true) {
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

var JEvent = JT.JEvent = {
    init: function () {
        var me = this;
        //click();
        //JEvent.click.call(me);
        var startCell,endCell;
        me.addListener('mousedown',function (cmd,evt) {
            startCell=evt.target;
        });
        me.addListener('mouseup',function (cmd,evt) {
            endCell=evt.target;
            console.log(startCell.cellIndex);
            console.log(endCell.cellIndex);
            var table = me.document.getElementById('tableInstant' + me.uid);
            me.update(table);
            var rng = me.getCellsRange(startCell,endCell);
            console.log(rng);
            me.setSelected(rng);
        });
        me.addListener('mousemove',function (cmd,evt) {
           //console.log(me.getRelation(evt.target,me.mouseCoords(evt)));
            //me.addSelectedClass();
            //console.log(evt.target.cellIndex);
            //console.log(this.getCell(evt.target.parentNode.rowIndex,evt.target.cellIndex));
            
        });


    },
    click: function () {
        // var me=this;
    }
};

var JTable = JT.JTable = function (options) {
    var me = this;
    me.uid = uid++;
    me.options = JUtils.extend(JUtils.clone(options || {}), JTABLE_CONFIG, true);
    me.container = document.getElementById(options.container);
    me.document = document;
    me.outputRules = [];
    //me.window = JUtils.getWindow(me.container);
    JCommand.load(me);
    JT.instants['tableInstant' + me.uid] = me;
    JEvent.init.call(me);
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
    getOpt: function (key) {
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
            return '<table contenteditable="true" id="' + 'tableInstant' + me.uid + '"><tbody>' + html.join('') + '</tbody></table>'
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
            this.options.tableStyle + this.options.selectTableStyle, me.document);
        JUtils.remove(div, true);
        a.fireEvent('mousedown');
    }
};
JT.commands["deletetable"] = {
    queryCommandState: function () {

    },
    execCommand: function (cmd, opt) {
        var me = this;
        var doc = me.document || document;
        var table = doc.getElementById('tableInstant' + me.uid);
        if (table && table.nodeType == 1) {
            table.parentNode && table.parentNode.removeChild(table);
        }
    }
};
JT.commands["insertcaption"] = {
    queryCommandState: function () {

    },
    execCommand: function (cmd, opt) {
        var me = this,
            doc = me.document || document,
            table = doc.getElementById('tableInstant' + me.uid);
        if (table && table.nodeType == 1) {
            var caption = this.document.createElement('caption');
            caption.innerHTML = '<br/>';
            table.insertBefore(caption, table.firstChild);
        }
    }
};
JT.commands["deletecaption"] = {
    queryCommandState: function () {

    },
    execCommand: function (cmd, opt) {
        var me = this;
        var doc = me.document || document;
        var table = doc.getElementById('tableInstant' + me.uid);
        if (table && table.nodeType == 1) {
            JUtils.remove(table.getElementsByTagName('caption')[0]);
        }
    }
};
JT.commands["inserttitlerow"] = {
    queryCommandState: function () {

    },
    execCommand: function (cmd, opt) {
        var me = this;
        var doc = me.document || document;
        var table = doc.getElementById('tableInstant' + me.uid);
        if (table && table.nodeType == 1) {
            getJTable(table).insertRow(0, 'th');
        }
    }
};
JT.commands["inserttitlecol"] = {
    queryCommandState: function () {

    },
    execCommand: function (cmd, opt) {
        var me = this;
        var doc = me.document || document;
        var table = doc.getElementById('tableInstant' + me.uid);
        if (table && table.nodeType == 1) {
            getJTable(table).insertCol(0, 'th');
        }
        //resetTdWidth(table, this);
    }
};
JT.commands["deletetitlerow"] = {
    queryCommandState: function () {

    },
    execCommand: function (cmd, opt) {
        var me = this;
        var doc = me.document || document;
        var table = doc.getElementById('tableInstant' + me.uid);
        if (table && table.nodeType == 1) {
            JUtils.remove(table.rows[0]);
        }
    }
};
JT.commands["deletetitlecol"] = {
    queryCommandState: function () {

    },
    execCommand: function (cmd, opt) {
        var me = this;
        var doc = me.document || document;
        var table = doc.getElementById('tableInstant' + me.uid);
        if (table && table.nodeType == 1) {
            for (var i = 0; i < table.rows.length; i++) {
                JUtils.remove(table.rows[i].children[0])
            }
        }
    }
};

var TableInfo = JTable.TableInfo = function (table) {
    this.table = table;
    this.indexTable = [];
    this.selectedTds = [];
    this.cellsRange = {};
    this.update(table);
    //JAction.prototype.update(table);
};
/**
 * 根据当前点击的td或者table获取索引对象
 * @param tdOrTable
 */
getJTable = function (tdOrTable) {
    var tag = tdOrTable.tagName.toLowerCase();
    tdOrTable = (tag == "td" || tag == "th" || tag == 'caption') ? JUtils.findParentByTagName(tdOrTable, "table", true) : tdOrTable;
    if (!tdOrTable.ueTable) {
        tdOrTable.ueTable = new TableInfo(tdOrTable);
    }
    return tdOrTable.ueTable;
};
function resetTdWidth(table, editor) {
    var tds = JUtils.getElementsByTagName(table, 'td th');
    JUtils.each(tds, function (td) {
        td.removeAttribute("width");
    });
    table.setAttribute('width', getTableWidth(editor, true, JCommand.getDefaultValue(editor, table)));
    var tdsWidths = [];
    setTimeout(function () {
        JUtils.each(tds, function (td) {
            (td.colSpan == 1) && tdsWidths.push(td.offsetWidth)
        });
        JUtils.each(tds, function (td, i) {
            (td.colSpan == 1) && td.setAttribute("width", tdsWidths[i] + "");
        })
    }, 0);
}
function getTableWidth(editor, needIEHack, defaultValue) {
    var body = editor.container;
    var b = (needIEHack ? parseInt(JUtils.getComputedStyle(body, 'margin-left'), 10) * 2 : 0) - defaultValue.tableBorder * 2 - (editor.options.offsetWidth || 0);

    return body.offsetWidth - (needIEHack ? parseInt(JUtils.getComputedStyle(body, 'margin-left'), 10) * 2 : 0) - defaultValue.tableBorder * 2 - (editor.options.offsetWidth || 0);
    //return editor.options.tableWidth;
}

var JAction = JTable.JAction = function () {


};
var dragButtonTimer,
    startTd = null, //鼠标按下时的锚点td
    currentTd = null, //当前鼠标经过时的td
    onDrag = "", //指示当前拖动状态，其值可为"","h","v" ,分别表示未拖动状态，横向拖动状态，纵向拖动状态，用于鼠标移动过程中的判断
    onBorder = false, //检测鼠标按下时是否处在单元格边缘位置
    dragButton = null,
    dragOver = false,
    dragLine = null, //模拟的拖动线
    dragTd = null,    //发生拖动的目标td
    tabTimer = null,
//拖动计时器
    tableDragTimer = null,
//双击计时器
    tableResizeTimer = null,
//单元格最小宽度
    cellMinWidth = 5,
    isInResizeBuffer = false,

//鼠标偏移距离
    offsetOfTableCell = 10,
//记录在有限时间内的点击状态， 共有3个取值， 0, 1, 2。 0代表未初始化， 1代表单击了1次，2代表2次
    singleClickState = 0,
    userActionStatus = null,
//双击允许的时间范围
    dblclickTime = 360;
JAction.prototype = {
    addSelectedClass:function (cells) {
        JUtils.each(cells, function (cell) {
            JUtils.addClass(cell, "selectTdClass");
        })
    },
    /**
     * 根据range设置已经选中的单元格
     */
    setSelected:function (range) {
        var cells = this.getCells(range);
        this.addSelectedClass(cells);
        this.selectedTds = cells;
        this.cellsRange = range;
    },
    /**
     * 清理已经选中的单元格
     */
    clearSelected:function () {
        this.removeSelectedClass(this.selectedTds);
        this.selectedTds = [];
        this.cellsRange = {};
    },
    removeSelectedClass:function (cells) {
        JUtils.each(cells, function (cell) {
            JUtils.removeClasses(cell, "selectTdClass");
        })
    },
    /**
     * 依据cellsRange获取对应的单元格集合
     */
    getCells:function (range) {
        //每次获取cells之前必须先清除上次的选择，否则会对后续获取操作造成影响
        this.clearSelected();
        var beginRowIndex = range.beginRowIndex,
            beginColIndex = range.beginColIndex,
            endRowIndex = range.endRowIndex,
            endColIndex = range.endColIndex,
            cellInfo, rowIndex, colIndex, tdHash = {}, returnTds = [];
        for (var i = beginRowIndex; i <= endRowIndex; i++) {
            for (var j = beginColIndex; j <= endColIndex; j++) {
                cellInfo = this.indexTable[i][j];
                rowIndex = cellInfo.rowIndex;
                colIndex = cellInfo.colIndex;
                // 如果Cells里已经包含了此Cell则跳过
                var key = rowIndex + '|' + colIndex;
                if (tdHash[key]) continue;
                tdHash[key] = 1;
                if (rowIndex < i || colIndex < j || rowIndex + cellInfo.rowSpan - 1 > endRowIndex || colIndex + cellInfo.colSpan - 1 > endColIndex) {
                    return null;
                }
                returnTds.push(this.getCell(rowIndex, cellInfo.cellIndex));
            }
        }
        return returnTds;
    },
    /**
     * 获取单元格的索引信息
     */
    getCellInfo:function (cell) {
        if (!cell) return;
        var cellIndex = cell.cellIndex,
            rowIndex = cell.parentNode.rowIndex,
            rowInfo = this.indexTable[rowIndex],
            numCols = this.colsNum;
        for (var colIndex = cellIndex; colIndex < numCols; colIndex++) {
            var cellInfo = rowInfo[colIndex];
            if (cellInfo.rowIndex === rowIndex && cellInfo.cellIndex === cellIndex) {
                return cellInfo;
            }
        }
    },
    getTableItemsByRange:function (editor) {
        var start = editor.selection.getStart();
        //ff下会选中bookmark
        if (start && start.id && start.id.indexOf('_baidu_bookmark_start_') === 0 && start.nextSibling) {
            start = start.nextSibling;
        }
    },
    getJTableBySelected : function (editor) {
        var table = this.getTableItemsByRange(editor).table;
        if (table && table.ueTable && table.ueTable.selectedTds.length) {
            return table.ueTable;
        }
        return null;
    },
    mouseMoveEvent: function mouseMoveEvent(evt) {
        //处理拖动及框选相关方法
        var me = this;
        try {
            //普通状态下鼠标移动
            var target = this.getParentTdOrTh(evt.target || evt.srcElement),
                pos;
            //修改单元格大小时的鼠标移动
            if (onDrag && dragTd) {
                singleClickState = 0;
                me.body.style.webkitUserSelect = 'none';
                me.selection.getNative()[browser.ie9below ? 'empty' : 'removeAllRanges']();
                pos = mouseCoords(evt);
                this.toggleDraggableState(me, true, onDrag, pos, target);
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
                // if (me.fireEvent('excludetable', target) === true)
                //     return;
                pos = this.mouseCoords(evt);
                var state = this.getRelation(target, pos),
                    table = JUtils.findParentByTagName(target, "table", true);

                if (this.inTableSide(table, target, evt, true)) {
                    if (me.fireEvent("excludetable", table) === true) return;
                    me.document.body.style.cursor = "url(" + me.options.cursorpath + "h.png),pointer";
                } else if (this.inTableSide(table, target, evt)) {
                    if (me.fireEvent("excludetable", table) === true) return;
                    me.document.body.style.cursor = "url(" + me.options.cursorpath + "v.png),pointer";
                } else {
                    me.document.body.style.cursor = "text";
                    var curCell = target;
                    if (/\d/.test(state)) {
                        state = state.replace(/\d/, '');
                        target = getJTable(target).getPreviewCell(target, state == "v");
                    }
                    //位于第一行的顶部或者第一列的左边时不可拖动
                    this.toggleDraggableState(me, target ? !!state : false, target ? state : '', pos, target);

                }
            } else {
                this.toggleDragButton(false, table, me);
            }

        } catch (e) {
            throw e;
        }
    },
    getDragLine: function (editor, doc) {
        if (mousedown)return;
        dragLine = editor.document.createElement("div");
        JUtils.setAttributes(dragLine, {
            id: "ue_tableDragLine",
            unselectable: 'on',
            contenteditable: false,
            'onresizestart': 'return false',
            'ondragstart': 'return false',
            'onselectstart': 'return false',
            style: "background-color:blue;position:absolute;padding:0;margin:0;background-image:none;border:0px none;opacity:0;filter:alpha(opacity=0)"
        });
        editor.appendChild(dragLine);
    },
    /**
     * 依据state（v|h）在cell位置显示横线
     * @param state
     * @param cell
     */
    showDragLineAt: function (state, cell) {
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
    },
    hideDragLine: function (editor) {
        if (mousedown)return;
        var line;
        while (line = editor.document.getElementById('ue_tableDragLine')) {
            JUtils.remove(line)
        }
    },
    toggleDragButton: function (show, table, editor) {
        //var dragOver = null;
        if (!show) {
            if (dragOver)return;
            dragButtonTimer = setTimeout(function () {
                !dragOver && dragButton && dragButton.parentNode && dragButton.parentNode.removeChild(dragButton);
            }, 2000);
        } else {
            this.createDragButton(table, editor);
        }
    },
    /**
     * 移动状态切换
     */

    toggleDraggableState: function (editor, draggable, dir, mousePos, cell) {
        try {
            editor.document.body.style.cursor = dir == "h" ? "col-resize" : dir == "v" ? "row-resize" : "text";
            if (browser.ie) {
                if (dir && !mousedown && !getJTableBySelected(editor)) {
                    this.getDragLine(editor, editor.document);
                    this.showDragLineAt(dir, cell);
                } else {
                    this.hideDragLine(editor)
                }
            }
            onBorder = draggable;
        } catch (e) {
            //showError(e);
            throw e;
        }
    },
    inTableSide: function (table, cell, evt, top) {
        var pos = this.mouseCoords(evt),
            state = this.getRelation(cell, pos);

        if (top) {
            var caption = table.getElementsByTagName("caption")[0],
                capHeight = caption ? caption.offsetHeight : 0;
            return (state == "v1") && ((pos.y - JUtils.getXY(table).y - capHeight) < 8);
        } else {
            return (state == "h1") && ((pos.x - JUtils.getXY(table).x) < 8);
        }
    },
    createDragButton: function (table, editor) {
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

        doc.appendChild(dragButton);
    },
    /**
     * 根据始末两个单元格获取被框选的所有单元格范围
     */
    getCellsRange:function (cellA, cellB) {
        function checkRange(beginRowIndex, beginColIndex, endRowIndex, endColIndex) {
            var tmpBeginRowIndex = beginRowIndex,
                tmpBeginColIndex = beginColIndex,
                tmpEndRowIndex = endRowIndex,
                tmpEndColIndex = endColIndex,
                cellInfo, colIndex, rowIndex;
            // 通过indexTable检查是否存在超出TableRange上边界的情况
            if (beginRowIndex > 0) {
                for (colIndex = beginColIndex; colIndex < endColIndex; colIndex++) {
                    cellInfo = me.indexTable[beginRowIndex][colIndex];
                    rowIndex = cellInfo.rowIndex;
                    if (rowIndex < beginRowIndex) {
                        tmpBeginRowIndex = Math.min(rowIndex, tmpBeginRowIndex);
                    }
                }
            }
            // 通过indexTable检查是否存在超出TableRange右边界的情况
            if (endColIndex < me.colsNum) {
                for (rowIndex = beginRowIndex; rowIndex < endRowIndex; rowIndex++) {
                    cellInfo = me.indexTable[rowIndex][endColIndex];
                    colIndex = cellInfo.colIndex + cellInfo.colSpan - 1;
                    if (colIndex > endColIndex) {
                        tmpEndColIndex = Math.max(colIndex, tmpEndColIndex);
                    }
                }
            }
            // 检查是否有超出TableRange下边界的情况
            if (endRowIndex < me.rowsNum) {
                for (colIndex = beginColIndex; colIndex < endColIndex; colIndex++) {
                    cellInfo = me.indexTable[endRowIndex][colIndex];
                    rowIndex = cellInfo.rowIndex + cellInfo.rowSpan - 1;
                    if (rowIndex > endRowIndex) {
                        tmpEndRowIndex = Math.max(rowIndex, tmpEndRowIndex);
                    }
                }
            }
            // 检查是否有超出TableRange左边界的情况
            if (beginColIndex > 0) {
                for (rowIndex = beginRowIndex; rowIndex < endRowIndex; rowIndex++) {
                    cellInfo = me.indexTable[rowIndex][beginColIndex];
                    colIndex = cellInfo.colIndex;
                    if (colIndex < beginColIndex) {
                        tmpBeginColIndex = Math.min(cellInfo.colIndex, tmpBeginColIndex);
                    }
                }
            }
            //递归调用直至所有完成所有框选单元格的扩展
            if (tmpBeginRowIndex != beginRowIndex || tmpBeginColIndex != beginColIndex || tmpEndRowIndex != endRowIndex || tmpEndColIndex != endColIndex) {
                return checkRange(tmpBeginRowIndex, tmpBeginColIndex, tmpEndRowIndex, tmpEndColIndex);
            } else {
                // 不需要扩展TableRange的情况
                return {
                    beginRowIndex:beginRowIndex,
                    beginColIndex:beginColIndex,
                    endRowIndex:endRowIndex,
                    endColIndex:endColIndex
                };
            }
        }

        try {
            var me = this,
                cellAInfo = me.getCellInfo(cellA);
            if (cellA === cellB) {
                return {
                    beginRowIndex:cellAInfo.rowIndex,
                    beginColIndex:cellAInfo.colIndex,
                    endRowIndex:cellAInfo.rowIndex + cellAInfo.rowSpan - 1,
                    endColIndex:cellAInfo.colIndex + cellAInfo.colSpan - 1
                };
            }
            var cellBInfo = me.getCellInfo(cellB);
            // 计算TableRange的四个边
            var beginRowIndex = Math.min(cellAInfo.rowIndex, cellBInfo.rowIndex),
                beginColIndex = Math.min(cellAInfo.colIndex, cellBInfo.colIndex),
                endRowIndex = Math.max(cellAInfo.rowIndex + cellAInfo.rowSpan - 1, cellBInfo.rowIndex + cellBInfo.rowSpan - 1),
                endColIndex = Math.max(cellAInfo.colIndex + cellAInfo.colSpan - 1, cellBInfo.colIndex + cellBInfo.colSpan - 1);

            return checkRange(beginRowIndex, beginColIndex, endRowIndex, endColIndex);
        } catch (e) {
            //throw e;
        }
    },
    /**
     * 获取鼠标与当前单元格的相对位置
     * @param ele
     * @param mousePos
     */
    getRelation: function (ele, mousePos) {
        var cellBorderWidth = 5;//单元格边框大小
        var elePos = JUtils.getXY(ele);

        if (!elePos) {
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
    },
    mouseCoords: function (evt) {
        var me=this;
        if (evt.pageX || evt.pageY) {
            return {x: evt.pageX, y: evt.pageY};
        }
        return {
            x: evt.clientX + me.document.scrollLeft - me.document.clientLeft,
            y: evt.clientY + me.document.scrollTop - me.document.clientTop
        };
    },
    getParentTdOrTh: function (ele) {
        if (ele.tagName == "TD" || ele.tagName == "TH") return ele;
        var td;
        if (td = JUtils.findParentByTagName(ele, "td", true) || JUtils.findParentByTagName(ele, "th", true)) return td;
        return null;
    },
    /**
     * 更新table对应的索引表
     */
    update: function (table) {
        this.table = table || this.table;
        this.selectedTds = [];
        this.cellsRange = {};
        this.indexTable = [];
        var rows = this.table.rows,
            rowsNum = this.getMaxRows(),
            dNum = rowsNum - rows.length,
            colsNum = this.getMaxCols();
        while (dNum--) {
            this.table.insertRow(rows.length);
        }
        this.rowsNum = rowsNum;
        this.colsNum = colsNum;
        for (var i = 0, len = rows.length; i < len; i++) {
            this.indexTable[i] = new Array(colsNum);
        }
        //填充索引表
        for (var rowIndex = 0, row; row = rows[rowIndex]; rowIndex++) {
            for (var cellIndex = 0, cell, cells = row.cells; cell = cells[cellIndex]; cellIndex++) {
                //修正整行被rowSpan时导致的行数计算错误
                if (cell.rowSpan > rowsNum) {
                    cell.rowSpan = rowsNum;
                }
                var colIndex = cellIndex,
                    rowSpan = cell.rowSpan || 1,
                    colSpan = cell.colSpan || 1;
                //当已经被上一行rowSpan或者被前一列colSpan了，则跳到下一个单元格进行
                while (this.indexTable[rowIndex][colIndex]) colIndex++;
                for (var j = 0; j < rowSpan; j++) {
                    for (var k = 0; k < colSpan; k++) {
                        this.indexTable[rowIndex + j][colIndex + k] = {
                            rowIndex: rowIndex,
                            cellIndex: cellIndex,
                            colIndex: colIndex,
                            rowSpan: rowSpan,
                            colSpan: colSpan
                        }
                    }
                }
            }
        }
        //修复残缺td
        for (j = 0; j < rowsNum; j++) {
            for (k = 0; k < colsNum; k++) {
                if (this.indexTable[j][k] === undefined) {
                    row = rows[j];
                    cell = row.cells[row.cells.length - 1];
                    cell = cell ? cell.cloneNode(true) : this.table.ownerDocument.createElement("td");
                    this.setCellContent(cell);
                    if (cell.colSpan !== 1)cell.colSpan = 1;
                    if (cell.rowSpan !== 1)cell.rowSpan = 1;
                    row.appendChild(cell);
                    this.indexTable[j][k] = {
                        rowIndex: j,
                        cellIndex: cell.cellIndex,
                        colIndex: k,
                        rowSpan: 1,
                        colSpan: 1
                    }
                }
            }
        }
        //当框选后删除行或者列后撤销，需要重建选区。
        var tds = JUtils.getElementsByTagName(this.table, "td"),
            selectTds = [];
        JUtils.each(tds, function (td) {
            if (JUtils.hasClass(td, "selectTdClass")) {
                selectTds.push(td);
            }
        });
        if (selectTds.length) {
            var start = selectTds[0],
                end = selectTds[selectTds.length - 1],
                startInfo = this.getCellInfo(start),
                endInfo = this.getCellInfo(end);
            this.selectedTds = selectTds;
            this.cellsRange = {
                beginRowIndex: startInfo.rowIndex,
                beginColIndex: startInfo.colIndex,
                endRowIndex: endInfo.rowIndex + endInfo.rowSpan - 1,
                endColIndex: endInfo.colIndex + endInfo.colSpan - 1
            };
        }
        //给第一行设置firstRow的样式名称,在排序图标的样式上使用到
        if (!JUtils.hasClass(this.table.rows[0], "firstRow")) {
            JUtils.addClass(this.table.rows[0], "firstRow");
            for (var i = 1; i < this.table.rows.length; i++) {
                JUtils.removeClasses(this.table.rows[i], "firstRow");
            }
        }
    },
    getMaxRows: function () {
        var rows = this.table.rows, maxLen = 1;
        for (var i = 0, row; row = rows[i]; i++) {
            var currentMax = 1;
            for (var j = 0, cj; cj = row.cells[j++];) {
                currentMax = Math.max(cj.rowSpan || 1, currentMax);
            }
            maxLen = Math.max(currentMax + i, maxLen);
        }
        return maxLen;
    },
    /**
     * 获取当前表格的最大列数
     */
    getMaxCols: function () {
        var rows = this.table.rows, maxLen = 0, cellRows = {};
        for (var i = 0, row; row = rows[i]; i++) {
            var cellsNum = 0;
            for (var j = 0, cj; cj = row.cells[j++];) {
                cellsNum += (cj.colSpan || 1);
                if (cj.rowSpan && cj.rowSpan > 1) {
                    for (var k = 1; k < cj.rowSpan; k++) {
                        if (!cellRows['row_' + (i + k)]) {
                            cellRows['row_' + (i + k)] = (cj.colSpan || 1);
                        } else {
                            cellRows['row_' + (i + k)]++
                        }
                    }

                }
            }
            cellsNum += cellRows['row_' + i] || 0;
            maxLen = Math.max(cellsNum, maxLen);
        }
        return maxLen;
    },
    getCellColIndex: function (cell) {

    },
    /**
     * 插入一行单元格
     */
    insertRow: function (rowIndex, sourceCell) {
        var numCols = this.colsNum,
            table = this.table,
            row = table.insertRow(rowIndex), cell,
            isInsertTitle = typeof sourceCell == 'string' && sourceCell.toUpperCase() == 'TH';

        function replaceTdToTh(colIndex, cell, tableRow) {
            if (colIndex == 0) {
                var tr = tableRow.nextSibling || tableRow.previousSibling,
                    th = tr.cells[colIndex];
                if (th.tagName == 'TH') {
                    th = cell.ownerDocument.createElement("th");
                    th.appendChild(cell.firstChild);
                    tableRow.insertBefore(th, cell);
                    JUtils.remove(cell)
                }
            } else {
                if (cell.tagName == 'TH') {
                    var td = cell.ownerDocument.createElement("td");
                    td.appendChild(cell.firstChild);
                    tableRow.insertBefore(td, cell);
                    JUtils.remove(cell)
                }
            }
        }

        //首行直接插入,无需考虑部分单元格被rowspan的情况
        if (rowIndex == 0 || rowIndex == this.rowsNum) {
            for (var colIndex = 0; colIndex < numCols; colIndex++) {
                cell = this.cloneCell(sourceCell, true);
                this.setCellContent(cell);
                cell.getAttribute('vAlign') && cell.setAttribute('vAlign', cell.getAttribute('vAlign'));
                row.appendChild(cell);
                if (!isInsertTitle) replaceTdToTh(colIndex, cell, row);
            }
        } else {
            var infoRow = this.indexTable[rowIndex],
                cellIndex = 0;
            for (colIndex = 0; colIndex < numCols; colIndex++) {
                var cellInfo = infoRow[colIndex];
                //如果存在某个单元格的rowspan穿过待插入行的位置，则修改该单元格的rowspan即可，无需插入单元格
                if (cellInfo.rowIndex < rowIndex) {
                    cell = this.getCell(cellInfo.rowIndex, cellInfo.cellIndex);
                    cell.rowSpan = cellInfo.rowSpan + 1;
                } else {
                    cell = this.cloneCell(sourceCell, true);
                    this.setCellContent(cell);
                    row.appendChild(cell);
                }
                if (!isInsertTitle) replaceTdToTh(colIndex, cell, row);
            }
        }
        //框选时插入不触发contentchange，需要手动更新索引。
        this.update();
        return row;
    },
    /**
     * 根据行列号获取单元格
     */
    getCell: function (rowIndex, cellIndex) {
        return rowIndex < this.rowsNum && this.table.rows[rowIndex].cells[cellIndex] || null;
    },
    insertCol: function (colIndex, sourceCell, defaultValue) {
        var rowsNum = this.rowsNum,
            rowIndex = 0,
            tableRow, cell,
            backWidth = parseInt((this.table.offsetWidth - (this.colsNum + 1) * 20 - (this.colsNum + 1)) / (this.colsNum + 1), 10),
            isInsertTitleCol = typeof sourceCell == 'string' && sourceCell.toUpperCase() == 'TH';

        function replaceTdToTh(rowIndex, cell, tableRow) {
            if (rowIndex == 0) {
                var th = cell.nextSibling || cell.previousSibling;
                if (th.tagName == 'TH') {
                    th = cell.ownerDocument.createElement("th");
                    th.appendChild(cell.firstChild);
                    tableRow.insertBefore(th, cell);
                    JUtils.remove(cell)
                }
            } else {
                if (cell.tagName == 'TH') {
                    var td = cell.ownerDocument.createElement("td");
                    td.appendChild(cell.firstChild);
                    tableRow.insertBefore(td, cell);
                    JUtils.remove(cell)
                }
            }
        }

        var preCell;
        if (colIndex == 0 || colIndex == this.colsNum) {
            for (; rowIndex < rowsNum; rowIndex++) {
                tableRow = this.table.rows[rowIndex];
                preCell = tableRow.cells[colIndex == 0 ? colIndex : tableRow.cells.length];
                cell = this.cloneCell(sourceCell, true); //tableRow.insertCell(colIndex == 0 ? colIndex : tableRow.cells.length);
                this.setCellContent(cell);
                //cell.setAttribute('vAlign', cell.getAttribute('vAlign'));
                preCell && cell.setAttribute('width', preCell.getAttribute('width'));
                preCell && cell.setAttribute('vAlign', preCell.getAttribute('vAlign'));

                if (!colIndex) {
                    tableRow.insertBefore(cell, tableRow.cells[0]);
                } else {
                    JUtils.insertAfter(tableRow.cells[tableRow.cells.length - 1], cell);
                }
                if (!isInsertTitleCol) replaceTdToTh(rowIndex, cell, tableRow)
            }
        } else {
            for (; rowIndex < rowsNum; rowIndex++) {
                var cellInfo = this.indexTable[rowIndex][colIndex];
                if (cellInfo.colIndex < colIndex) {
                    cell = this.getCell(cellInfo.rowIndex, cellInfo.cellIndex);
                    cell.colSpan = cellInfo.colSpan + 1;
                } else {
                    tableRow = this.table.rows[rowIndex];
                    preCell = tableRow.cells[cellInfo.cellIndex];

                    cell = this.cloneCell(sourceCell, true);//tableRow.insertCell(cellInfo.cellIndex);
                    this.setCellContent(cell);
                    //cell.setAttribute('vAlign', cell.getAttribute('vAlign'));
                    preCell && cell.setAttribute('width', preCell.getAttribute('width'));
                    preCell && cell.setAttribute('vAlign', preCell.getAttribute('vAlign'));
                    //防止IE下报错
                    preCell ? tableRow.insertBefore(cell, preCell) : tableRow.appendChild(cell);
                }
                if (!isInsertTitleCol) replaceTdToTh(rowIndex, cell, tableRow);
            }
        }
        //框选时插入不触发contentchange，需要手动更新索引
        this.update();
        this.updateWidth(backWidth, defaultValue || {tdPadding: 10, tdBorder: 1});
    },
    updateWidth: function (width, defaultValue) {
        var table = this.table,
            tmpWidth = this.getWidth(table) - defaultValue.tdPadding * 2 - defaultValue.tdBorder + width;
        if (tmpWidth < table.ownerDocument.body.offsetWidth) {
            table.setAttribute("width", tmpWidth);
            return;
        }
        var tds = JUtils.getElementsByTagName(this.table, "td th");
        JUtils.each(tds, function (td) {
            td.setAttribute("width", width);
        })
    },
    cloneCell: function (cell, ignoreMerge, keepPro) {
        if (!cell || JUtils.isString(cell)) {
            return this.table.ownerDocument.createElement(cell || 'td');
        }
        var flag = JUtils.hasClass(cell, "selectTdClass");
        flag && JUtils.removeClasses(cell, "selectTdClass");
        var tmpCell = cell.cloneNode(true);
        if (ignoreMerge) {
            tmpCell.rowSpan = tmpCell.colSpan = 1;
        }
        //去掉宽高
        !keepPro && JUtils.removeAttributes(tmpCell, 'width height');
        !keepPro && JUtils.removeAttributes(tmpCell, 'style');

        tmpCell.style.borderLeftStyle = "";
        tmpCell.style.borderTopStyle = "";
        tmpCell.style.borderLeftColor = cell.style.borderRightColor;
        tmpCell.style.borderLeftWidth = cell.style.borderRightWidth;
        tmpCell.style.borderTopColor = cell.style.borderBottomColor;
        tmpCell.style.borderTopWidth = cell.style.borderBottomWidth;
        flag && JUtils.addClass(cell, "selectTdClass");
        return tmpCell;
    },
    setCellContent: function (cell, content) {
        cell.innerHTML = content || (browser.ie ? JUtils.fillChar : "<br />");
    },
    getWidth: function (cell) {
        if (!cell)return 0;
        return parseInt(JUtils.getComputedStyle(cell, "width"), 10);
    },
    getPreviewCell: function (cell, top) {
        try {
            var cellInfo = this.getCellInfo(cell),
                previewRowIndex, previewColIndex;
            var len = this.selectedTds.length,
                range = this.cellsRange;
            //首行或者首列没有前置单元格
            if ((!top && (!len ? !cellInfo.colIndex : !range.beginColIndex)) || (top && (!len ? (cellInfo.rowIndex > (this.colsNum - 1)) : (range.endColIndex == this.colsNum - 1)))) return null;

            previewRowIndex = !top ? ( !len ? cellInfo.rowIndex : range.beginRowIndex )
                : ( !len ? (cellInfo.rowIndex < 1 ? 0 : (cellInfo.rowIndex - 1)) : range.beginRowIndex);
            previewColIndex = !top ? ( !len ? (cellInfo.colIndex < 1 ? 0 : (cellInfo.colIndex - 1)) : range.beginColIndex - 1)
                : ( !len ? cellInfo.colIndex : range.endColIndex + 1);
            return this.getCell(this.indexTable[previewRowIndex][previewColIndex].rowIndex, this.indexTable[previewRowIndex][previewColIndex].cellIndex);
        } catch (e) {
            //showError(e);
            throw e;
        }
    },
    /**
     * 获取单元格的索引信息
     */
    getCellInfo: function (cell) {
        if (!cell) return;
        var cellIndex = cell.cellIndex,
            rowIndex = cell.parentNode.rowIndex,
            rowInfo = this.indexTable[rowIndex],
            numCols = this.colsNum;
        for (var colIndex = cellIndex; colIndex < numCols; colIndex++) {
            var cellInfo = rowInfo[colIndex];
            if (cellInfo.rowIndex === rowIndex && cellInfo.cellIndex === cellIndex) {
                return cellInfo;
            }
        }
    },
};


var JUtils = JT.JUtils = {
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
    isBody: function (node) {
        return node && node.nodeType == 1 && node.tagName.toLowerCase() == 'body';
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
    findParent: function (node, filterFn, includeSelf) {
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
    getXY: function (element) {
        var x = 0, y = 0;
        while (element.offsetParent) {
            y += element.offsetTop;
            x += element.offsetLeft;
            element = element.offsetParent;
        }
        return {'x': x, 'y': y};
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
     * console.log( UE.JUtils.listToMap( 'UEdtior,Hello' ) );
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
     * console.log( UE.JUtils.listToMap( [ 'UEdtior', 'Hello' ] ) );
     *
     * ```
     */
    listToMap: function (list) {
        if (!list)return {};
        list = list.constructor == Array ? list : list.split(',');
        for (var i = 0, ci, obj = {}; ci = list[i++];) {
            obj[ci.toUpperCase()] = obj[ci] = 1;
        }
        return obj;
    },
    /**
     * 删除节点node上的指定属性名称的属性
     * @method  removeAttributes
     * @param { Node } node 需要删除属性的节点对象
     * @param { String } attrNames 可以是空格隔开的多个属性名称，该操作将会依次删除相应的属性
     * @example
     * ```html
     * <div id="wrap">
     *      <span style="font-size:14px;" id="test" name="followMe">xxxxx</span>
     * </div>
     *
     * <script>
     *
     *     UE.dom.JUtils.removeAttributes( document.getElementById( "test" ), "id name" );
     *
     *     //output: <span style="font-size:14px;">xxxxx</span>
     *     console.log( document.getElementById("wrap").innerHTML );
     *
     * </script>
     * ```
     */

    /**
     * 删除节点node上的指定属性名称的属性
     * @method  removeAttributes
     * @param { Node } node 需要删除属性的节点对象
     * @param { Array } attrNames 需要删除的属性名数组
     * @example
     * ```html
     * <div id="wrap">
     *      <span style="font-size:14px;" id="test" name="followMe">xxxxx</span>
     * </div>
     *
     * <script>
     *
     *     UE.dom.JUtils.removeAttributes( document.getElementById( "test" ), ["id", "name"] );
     *
     *     //output: <span style="font-size:14px;">xxxxx</span>
     *     console.log( document.getElementById("wrap").innerHTML );
     *
     * </script>
     * ```
     */
    removeAttributes: function (node, attrNames) {
        attrNames = JUtils.isArray(attrNames) ? attrNames : JUtils.trim(attrNames).replace(/[ ]{2,}/g, ' ').split(' ');
        for (var i = 0, ci; ci = attrNames[i++];) {
            ci = attrFix[ci] || ci;
            switch (ci) {
                case 'className':
                    node[ci] = '';
                    break;
                case 'style':
                    node.style.cssText = '';
                    var val = node.getAttributeNode('style');
                    !browser.ie && val && node.removeAttributeNode(val);
            }
            node.removeAttribute(ci);
        }
    },
    /**
     * 删除元素element指定的className
     * @method removeClasses
     * @param { Element } ele 需要删除class的元素节点
     * @param { String } classNames 需要删除的className， 多个className之间以空格分开
     * @example
     * ```html
     * <span id="test" class="test1 test2 test3">xxx</span>
     *
     * <script>
     *
     *     var testNode = document.getElementById( "test" );
     *     UE.dom.JUtils.removeClasses( testNode, "test1 test2" );
     *
     *     //output: test3
     *     console.log( testNode.className );
     *
     * </script>
     * ```
     */

    /**
     * 删除元素element指定的className
     * @method removeClasses
     * @param { Element } ele 需要删除class的元素节点
     * @param { Array } classNames 需要删除的className数组
     * @example
     * ```html
     * <span id="test" class="test1 test2 test3">xxx</span>
     *
     * <script>
     *
     *     var testNode = document.getElementById( "test" );
     *     UE.dom.JUtils.removeClasses( testNode, ["test1", "test2"] );
     *
     *     //output: test3
     *     console.log( testNode.className );
     *
     * </script>
     * ```
     */
    removeClasses: function (elm, classNames) {
        classNames = JUtils.isArray(classNames) ? classNames :
            JUtils.trim(classNames).replace(/[ ]{2,}/g, ' ').split(' ');
        for (var i = 0, ci, cls = elm.className; ci = classNames[i++];) {
            cls = cls.replace(new RegExp('\\b' + ci + '\\b'), '')
        }
        cls = JUtils.trim(cls).replace(/[ ]{2,}/g, ' ');
        if (cls) {
            elm.className = cls;
        } else {
            JUtils.removeAttributes(elm, ['class']);
        }
    },
    /**
     * 给元素element添加className
     * @method addClass
     * @param { Node } ele 需要增加className的元素
     * @param { Array } classNames 需要添加的className的数组
     * @remind 相同的类名不会被重复添加
     * @example
     * ```html
     * <span id="test" class="cls1 cls2"></span>
     *
     * <script>
     *     var testNode = document.getElementById("test");
     *
     *     UE.dom.JUtils.addClass( testNode, ["cls2", "cls3", "cls4"] );
     *
     *     //output: cl1 cls2 cls3 cls4
     *     console.log( testNode.className );
     *
     * <script>
     * ```
     */
    addClass: function (elm, classNames) {
        if (!elm)return;
        classNames = JUtils.trim(classNames).replace(/[ ]{2,}/g, ' ').split(' ');
        for (var i = 0, ci, cls = elm.className; ci = classNames[i++];) {
            if (!new RegExp('\\b' + ci + '\\b').test(cls)) {
                cls += ' ' + ci;
            }
        }
        elm.className = JUtils.trim(cls);
    },
    /**
     * 判断元素element是否包含给定的样式类名className
     * @method hasClass
     * @param { Node } ele 需要检测的元素
     * @param { String } classNames 需要检测的className， 多个className之间用空格分割
     * @return { Boolean } 元素是否包含所有给定的className
     * @example
     * ```html
     * <span id="test1" class="cls1 cls2"></span>
     *
     * <script>
     *     var test1 = document.getElementById("test1");
     *
     *     //output: false
     *     console.log( UE.dom.JUtils.hasClass( test1, "cls2 cls1 cls3" ) );
     *
     *     //output: true
     *     console.log( UE.dom.JUtils.hasClass( test1, "cls2 cls1" ) );
     * </script>
     * ```
     */

    /**
     * 判断元素element是否包含给定的样式类名className
     * @method hasClass
     * @param { Node } ele 需要检测的元素
     * @param { Array } classNames 需要检测的className数组
     * @return { Boolean } 元素是否包含所有给定的className
     * @example
     * ```html
     * <span id="test1" class="cls1 cls2"></span>
     *
     * <script>
     *     var test1 = document.getElementById("test1");
     *
     *     //output: false
     *     console.log( UE.dom.JUtils.hasClass( test1, [ "cls2", "cls1", "cls3" ] ) );
     *
     *     //output: true
     *     console.log( UE.dom.JUtils.hasClass( test1, [ "cls2", "cls1" ]) );
     * </script>
     * ```
     */
    hasClass: function (element, className) {
        if (JUtils.isRegExp(className)) {
            return className.test(element.className)
        }
        className = JUtils.trim(className).replace(/[ ]{2,}/g, ' ').split(' ');
        for (var i = 0, ci, cls = element.className; ci = className[i++];) {
            if (!new RegExp('\\b' + ci + '\\b', 'i').test(cls)) {
                return false;
            }
        }
        return i - 1 == className.length;
    },
    /**
     * 原生方法getElementsByTagName的封装
     * @method getElementsByTagName
     * @param { Node } node 目标节点对象
     * @param { String } tagName 需要查找的节点的tagName， 多个tagName以空格分割
     * @return { Array } 符合条件的节点集合
     */
    getElementsByTagName: function (node, name, filter) {
        if (filter && JUtils.isString(filter)) {
            var className = filter;
            filter = function (node) {
                return JUtils.hasClass(node, className)
            }
        }
        name = JUtils.trim(name).replace(/[ ]{2,}/g, ' ').split(' ');
        var arr = [];
        for (var n = 0, ni; ni = name[n++];) {
            var list = node.getElementsByTagName(ni);
            for (var i = 0, ci; ci = list[i++];) {
                if (!filter || filter(ci))
                    arr.push(ci);
            }
        }
        return arr;
    },
    /**
     * 为节点node添加属性attrs，attrs为属性键值对
     * @method setAttributes
     * @param { Element } node 需要设置属性的元素对象
     * @param { Object } attrs 需要设置的属性名-值对
     * @return { Element } 设置属性的元素对象
     * @example
     * ```html
     * <span id="test"></span>
     *
     * <script>
     *
     *     var testNode = UE.dom.JUtils.setAttributes( document.getElementById( "test" ), {
     *         id: 'demo'
     *     } );
     *
     *     //output: demo
     *     console.log( testNode.id );
     *
     * </script>
     *
     */
    setAttributes: function (node, attrs) {
        for (var attr in attrs) {
            if (attrs.hasOwnProperty(attr)) {
                var value = attrs[attr];
                switch (attr) {
                    case 'class':
                        //ie下要这样赋值，setAttribute不起作用
                        node.className = value;
                        break;
                    case 'style' :
                        node.style.cssText = node.style.cssText + ";" + value;
                        break;
                    case 'innerHTML':
                        node[attr] = value;
                        break;
                    case 'value':
                        node.value = value;
                        break;
                    default:
                        node.setAttribute(attrFix[attr] || attr, value);
                }
            }
        }
        return node;
    },
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
    on: function (element, type, handler) {
        var types = JUtils.isArray(type) ? type : JUtils.trim(type).split(/\s+/),
            k = types.length;
        if (k) while (k--) {
            type = types[k];
            if (element.addEventListener) {
                element.addEventListener(type, handler, false);
            } else {
                if (!handler._d) {
                    handler._d = {
                        els: []
                    };
                }
                var key = type + handler.toString(), index = JUtils.indexOf(handler._d.els, element);
                if (!handler._d[key] || index == -1) {
                    if (index == -1) {
                        handler._d.els.push(element);
                    }
                    if (!handler._d[key]) {
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
    un: function (element, type, handler) {
        var types = JUtils.isArray(type) ? type : JUtils.trim(type).split(/\s+/),
            k = types.length;
        if (k) while (k--) {
            type = types[k];
            if (element.removeEventListener) {
                element.removeEventListener(type, handler, false);
            } else {
                var key = type + handler.toString();
                try {
                    element.detachEvent('on' + type, handler._d ? handler._d[key] : handler);
                } catch (e) {
                }
                if (handler._d && handler._d[key]) {
                    var index = JUtils.indexOf(handler._d.els, element);
                    if (index != -1) {
                        handler._d.els.splice(index, 1);
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
    each: function (obj, iterator, context) {
        if (obj == null) return;
        if (obj.length === +obj.length) {
            for (var i = 0, l = obj.length; i < l; i++) {
                if (iterator.call(context, obj[i], i, obj) === false)
                    return false;
            }
        } else {
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (iterator.call(context, obj[key], key, obj) === false)
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
    findParentByTagName: function (node, tagNames, includeSelf, excludeFn) {
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
    makeInstance: function (obj) {
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
    inherits: function (subClass, superClass) {
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
    removeItem: function (array, item) {
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
    trim: function (str) {
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
    cssRule: function (key, style, doc) {
        var head, node;
        if (style === undefined || style && style.nodeType && style.nodeType == 9) {
            //获取样式
            doc = style && style.nodeType && style.nodeType == 9 ? style : (doc || document);
            node = doc.getElementById(key);
            return node ? node.innerHTML : undefined;
        }
        doc = doc || document;
        node = doc.getElementById(key);

        //清除样式
        if (style === '') {
            if (node) {
                node.parentNode.removeChild(node);
                return true
            }
            return false;
        }
        var styleDom = doc.createElement('style');
        styleDom.id = key;
        styleDom.innerHTML = style;
        doc.head.appendChild(styleDom);
    }
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
JUtils.inherits(JTable, JEventBase);
JUtils.inherits(JTable, JAction);
JUtils.inherits(TableInfo, JAction);