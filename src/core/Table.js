/**
 * 编辑器主类，包含编辑器提供的大部分公用接口
 * @file
 * @module UE
 * @class Editor
 * @since 1.2.6.1
 */

/**
 * UEditor公用空间，UEditor所有的功能都挂载在该空间下
 * @unfile
 * @module UE
 */

/**
 * UEditor的核心类，为用户提供与编辑器交互的接口。
 * @unfile
 * @module UE
 * @class Editor
 */

(function () {
    var uid = 0, _selectionChangeTimer;



    /**
     * 编辑器准备就绪后会触发该事件
     * @module UE
     * @class Editor
     * @event ready
     * @remind render方法执行完成之后,会触发该事件
     * @remind
     * @example
     * ```javascript
     * editor.addListener( 'ready', function( editor ) {
     *     editor.execCommand( 'focus' ); //编辑器家在完成后，让编辑器拿到焦点
     * } );
     * ```
     */
    /**
     * 执行destroy方法,会触发该事件
     * @module UE
     * @class Editor
     * @event destroy
     * @see UE.Editor:destroy()
     */
    /**
     * 执行reset方法,会触发该事件
     * @module UE
     * @class Editor
     * @event reset
     * @see UE.Editor:reset()
     */
    /**
     * 执行focus方法,会触发该事件
     * @module UE
     * @class Editor
     * @event focus
     * @see UE.Editor:focus(Boolean)
     */
    /**
     * 语言加载完成会触发该事件
     * @module UE
     * @class Editor
     * @event langReady
     */
    /**
     * 运行命令之后会触发该命令
     * @module UE
     * @class Editor
     * @event beforeExecCommand
     */
    /**
     * 运行命令之后会触发该命令
     * @module UE
     * @class Editor
     * @event afterExecCommand
     */
    /**
     * 运行命令之前会触发该命令
     * @module UE
     * @class Editor
     * @event firstBeforeExecCommand
     */
    /**
     * 在getContent方法执行之前会触发该事件
     * @module UE
     * @class Editor
     * @event beforeGetContent
     * @see UE.Editor:getContent()
     */
    /**
     * 在getContent方法执行之后会触发该事件
     * @module UE
     * @class Editor
     * @event afterGetContent
     * @see UE.Editor:getContent()
     */
    /**
     * 在getAllHtml方法执行时会触发该事件
     * @module UE
     * @class Editor
     * @event getAllHtml
     * @see UE.Editor:getAllHtml()
     */
    /**
     * 在setContent方法执行之前会触发该事件
     * @module UE
     * @class Editor
     * @event beforeSetContent
     * @see UE.Editor:setContent(String)
     */
    /**
     * 在setContent方法执行之后会触发该事件
     * @module UE
     * @class Editor
     * @event afterSetContent
     * @see UE.Editor:setContent(String)
     */
    /**
     * 每当编辑器内部选区发生改变时，将触发该事件
     * @event selectionchange
     * @warning 该事件的触发非常频繁，不建议在该事件的处理过程中做重量级的处理
     * @example
     * ```javascript
     * editor.addListener( 'selectionchange', function( editor ) {
     *     console.log('选区发生改变');
     * }
     */
    /**
     * 在所有selectionchange的监听函数执行之前，会触发该事件
     * @module UE
     * @class Editor
     * @event beforeSelectionChange
     * @see UE.Editor:selectionchange
     */
    /**
     * 在所有selectionchange的监听函数执行完之后，会触发该事件
     * @module UE
     * @class Editor
     * @event afterSelectionChange
     * @see UE.Editor:selectionchange
     */
    /**
     * 编辑器内容发生改变时会触发该事件
     * @module UE
     * @class Editor
     * @event contentChange
     */


    /**
     * 以默认参数构建一个编辑器实例
     * @constructor
     * @remind 通过 改构造方法实例化的编辑器,不带ui层.需要render到一个容器,编辑器实例才能正常渲染到页面
     * @example
     * ```javascript
     * var editor = new UE.Editor();
     * editor.execCommand('blod');
     * ```
     * @see UE.Config
     */

    /**
     * 以给定的参数集合创建一个编辑器实例，对于未指定的参数，将应用默认参数。
     * @constructor
     * @remind 通过 改构造方法实例化的编辑器,不带ui层.需要render到一个容器,编辑器实例才能正常渲染到页面
     * @param { Object } setting 创建编辑器的参数
     * @example
     * ```javascript
     * var editor = new UE.Editor();
     * editor.execCommand('blod');
     * ```
     * @see UE.Config
     */
    var Table = JT.Table = function (options) {
        var me = this;
        me.uid = uid++; //表格唯一识别编号
        me.EventBase=EventBase.prototype;
        me.commands = {};
        me.options = utils.extend(utils.clone(options || {}), JTABLE_CONFIG, true);
        me.outputRules = [];
        JT.plugin.register('table',JT.plugins.table);

        JT.plugin.load(me);
        JT.instants['tableInstant' + me.uid] = me;
    };
    Table.prototype = {
         registerCommand : function(name,obj){
            this.commands[name] = obj;
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
            if (utils.isString(key)) {
                obj[key] = val
            } else {
                obj = key;
            }
            utils.extend(this.options, obj, true);
        },
        getOpt:function(key){
            return this.options[key]
        },
        /**
         * 销毁编辑器实例，使用textarea代替
         * @method destroy
         * @example
         * ```javascript
         * editor.destroy();
         * ```
         */
        destroy: function () {
            var me = this;
            me.fireEvent('destroy');
            var container = me.container;
            container.innerHTML = '';
            if(me.options.destoryContainer){
                domUtils.remove(container);
            }
            var key = me.key;
            //trace:2004
            for (var p in me) {
                if (me.hasOwnProperty(p)) {
                    delete this[p];
                }
            }
            JT.delTable(key);
        },

        /**
         * 渲染编辑器的DOM到指定容器
         * @method render
         * @param { String } containerId 指定一个容器ID
         * @remind 执行该方法,会触发ready事件
         * @warning 必须且只能调用一次
         */

        /**
         * 渲染编辑器的DOM到指定容器
         * @method render
         * @param { Element } containerDom 直接指定容器对象
         * @remind 执行该方法,会触发ready事件
         * @warning 必须且只能调用一次
         */
        render: function (container) {
            var me = this,
                options = me.options,
                doc=document.getElementById(container);
                doc.setAttribute("table-id",'tableInstant' + me.uid);
            me.selection = new dom.Selection(document);
            me.container=doc;
            me.document=document;
            if (ie) {
                doc.disabled = true;
                doc.contentEditable = false;
                doc.disabled = false;
            } else {
                doc.contentEditable = false;
            }
            doc.spellcheck = false;

            //gecko初始化就能得到range,无法判断isFocus了
            var geckoSel;
            if (browser.gecko && (geckoSel = this.selection.getNative())) {
                geckoSel.removeAllRanges();
            }
            //me.selection.document.innerHTML = '<table><tbody><tr class="firstRow"><td width="215" valign="top">1</td><td width="215" valign="top">2</td><td width="215" valign="top">3</td></tr><tr><td width="215" valign="top">4</td><td width="215" valign="top">5</td><td width="215" valign="top">6</td></tr></tbody></table>';
            me.idReady=1;
            options.onready && options.onready.call(me);
            me.execCommand("inserttable", options);
            //this._initEvents();
        },



        /**
         * 设置编辑器高度
         * @method setHeight
         * @remind 当配置项autoHeightEnabled为真时,该方法无效
         * @param { Number } number 设置的高度值，纯数值，不带单位
         * @example
         * ```javascript
         * editor.setHeight(number);
         * ```
         */
        setHeight: function (height,notSetHeight) {
            if (height !== parseInt(this.iframe.parentNode.style.height)) {
                this.iframe.parentNode.style.height = height + 'px';
            }
            !notSetHeight && (this.options.minFrameHeight = this.options.initialFrameHeight = height);
            this.body.style.height = height + 'px';
            !notSetHeight && this.trigger('setHeight')
        },

        /**
         * 对编辑器设置keydown事件监听，绑定快捷键和命令，当快捷键组合触发成功，会响应对应的命令
         * @method _bindshortcutKeys
         * @private
         */
        _bindshortcutKeys: function () {
            var me = this, shortcutkeys = this.shortcutkeys;
            me.addListener('keydown', function (type, e) {
                var keyCode = e.keyCode || e.which;
                for (var i in shortcutkeys) {
                    var tmp = shortcutkeys[i].split(',');
                    for (var t = 0, ti; ti = tmp[t++];) {
                        ti = ti.split(':');
                        var key = ti[0], param = ti[1];
                        if (/^(ctrl)(\+shift)?\+(\d+)$/.test(key.toLowerCase()) || /^(\d+)$/.test(key)) {
                            if (( (RegExp.$1 == 'ctrl' ? (e.ctrlKey || e.metaKey) : 0)
                                && (RegExp.$2 != "" ? e[RegExp.$2.slice(1) + "Key"] : 1)
                                && keyCode == RegExp.$3
                                ) ||
                                keyCode == RegExp.$1
                                ) {
                                if (me.queryCommandState(i,param) != -1)
                                    me.execCommand(i, param);
                                domUtils.preventDefault(e);
                            }
                        }
                    }

                }
            });
        },


        /**
         * 设置编辑器的内容，可修改编辑器当前的html内容
         * @method setContent
         * @warning 通过该方法插入的内容，是经过编辑器内置的过滤规则进行过滤后得到的内容
         * @warning 该方法会触发selectionchange事件
         * @param { String } html 要插入的html内容
         * @example
         * ```javascript
         * editor.getContent('<p>test</p>');
         * ```
         */

        /**
         * 设置编辑器的内容，可修改编辑器当前的html内容
         * @method setContent
         * @warning 通过该方法插入的内容，是经过编辑器内置的过滤规则进行过滤后得到的内容
         * @warning 该方法会触发selectionchange事件
         * @param { String } html 要插入的html内容
         * @param { Boolean } isAppendTo 若传入true，不清空原来的内容，在最后插入内容，否则，清空内容再插入
         * @example
         * ```javascript
         * //假设设置前的编辑器内容是 <p>old text</p>
         * editor.setContent('<p>new text</p>', true); //插入的结果是<p>old text</p><p>new text</p>
         * ```
         */
        setContent: function (html, isAppendTo, notFireSelectionchange) {
            var me = this;

            me.fireEvent('beforesetcontent', html);
            var root = UE.htmlparser(html);
            me.filterInputRule(root);
            html = root.toHtml();

            me.body.innerHTML = (isAppendTo ? me.body.innerHTML : '') + html;


            function isCdataDiv(node){
                return  node.tagName == 'DIV' && node.getAttribute('cdata_tag');
            }
            //给文本或者inline节点套p标签
            if (me.options.enterTag == 'p') {

                var child = this.body.firstChild, tmpNode;
                if (!child || child.nodeType == 1 &&
                    (dtd.$cdata[child.tagName] || isCdataDiv(child) ||
                        domUtils.isCustomeNode(child)
                        )
                    && child === this.body.lastChild) {
                    this.body.innerHTML = '<p>' + (browser.ie ? '&nbsp;' : '<br/>') + '</p>' + this.body.innerHTML;

                } else {
                    var p = me.document.createElement('p');
                    while (child) {
                        while (child && (child.nodeType == 3 || child.nodeType == 1 && dtd.p[child.tagName] && !dtd.$cdata[child.tagName])) {
                            tmpNode = child.nextSibling;
                            p.appendChild(child);
                            child = tmpNode;
                        }
                        if (p.firstChild) {
                            if (!child) {
                                me.body.appendChild(p);
                                break;
                            } else {
                                child.parentNode.insertBefore(p, child);
                                p = me.document.createElement('p');
                            }
                        }
                        child = child.nextSibling;
                    }
                }
            }
            me.fireEvent('aftersetcontent');
            me.fireEvent('contentchange');

            !notFireSelectionchange && me._selectionChange();
            //清除保存的选区
            me._bakRange = me._bakIERange = me._bakNativeRange = null;
            //trace:1742 setContent后gecko能得到焦点问题
            var geckoSel;
            if (browser.gecko && (geckoSel = this.selection.getNative())) {
                geckoSel.removeAllRanges();
            }
            if(me.options.autoSyncData){
                me.form && setValue(me.form,me);
            }
        },

        /**
         * 让编辑器获得焦点，默认focus到编辑器头部
         * @method focus
         * @example
         * ```javascript
         * editor.focus()
         * ```
         */

        /**
         * 让编辑器获得焦点，toEnd确定focus位置
         * @method focus
         * @param { Boolean } toEnd 默认focus到编辑器头部，toEnd为true时focus到内容尾部
         * @example
         * ```javascript
         * editor.focus(true)
         * ```
         */
        focus: function (toEnd) {
            try {
                var me = this,
                    rng = me.selection.getRange();
                if (toEnd) {
                    var node = me.body.lastChild;
                    if(node && node.nodeType == 1 && !dtd.$empty[node.tagName]){
                        if(domUtils.isEmptyBlock(node)){
                            rng.setStartAtFirst(node)
                        }else{
                            rng.setStartAtLast(node)
                        }
                        rng.collapse(true);
                    }
                    rng.setCursor(true);
                } else {
                    if(!rng.collapsed && domUtils.isBody(rng.startContainer) && rng.startOffset == 0){

                        var node = me.body.firstChild;
                        if(node && node.nodeType == 1 && !dtd.$empty[node.tagName]){
                            rng.setStartAtFirst(node).collapse(true);
                        }
                    }

                    rng.select(true);

                }
                this.fireEvent('focus selectionchange');
            } catch (e) {
            }

        },
        isFocus:function(){
            return this.selection.isFocus();
        },
        blur:function(){
            var sel = this.selection.getNative();
            if(sel.empty && browser.ie){
                var nativeRng = document.body.createTextRange();
                nativeRng.moveToElementText(document.body);
                nativeRng.collapse(true);
                nativeRng.select();
                sel.empty()
            }else{
                sel.removeAllRanges()
            }

            //this.fireEvent('blur selectionchange');
        },
        /**
         * 初始化UE事件及部分事件代理
         * @method _initEvents
         * @private
         */
        _initEvents: function () {
            var me = this,
                doc = me.document,
                win = me.window;
            me._proxyDomEvent = utils.bind(me._proxyDomEvent, me);
            domUtils.on(doc, ['click', 'contextmenu', 'mousedown', 'keydown', 'keyup', 'keypress', 'mouseup', 'mouseover', 'mouseout', 'selectstart'], me._proxyDomEvent);
            //domUtils.on(doc, ['click', 'contextmenu', 'mousedown', 'keydown', 'keyup', 'keypress', 'mouseup', 'mouseover', 'mouseout'], me._proxyDomEvent);
            domUtils.on(win, ['focus', 'blur'], me._proxyDomEvent);
            domUtils.on(me.body,'drop',function(e){
                //阻止ff下默认的弹出新页面打开图片
                if(browser.gecko && e.stopPropagation) { e.stopPropagation(); }
                me.fireEvent('contentchange')
            });
            domUtils.on(doc, ['mouseup', 'keydown'], function (evt) {
                //特殊键不触发selectionchange
                if (evt.type == 'keydown' && (evt.ctrlKey || evt.metaKey || evt.shiftKey || evt.altKey)) {
                    return;
                }
                if (evt.button == 2)return;
                me._selectionChange(250, evt);
            });
        },
        /**
         * 触发事件代理
         * @method _proxyDomEvent
         * @private
         * @return { * } fireEvent的返回值
         * @see UE.EventBase:fireEvent(String)
         */
        _proxyDomEvent: function (evt) {
            if(this.fireEvent('before' + evt.type.replace(/^on/, '').toLowerCase()) === false){
                return false;
            }
            if(this.fireEvent(evt.type.replace(/^on/, ''), evt) === false){
                return false;
            }
            return this.fireEvent('after' + evt.type.replace(/^on/, '').toLowerCase())
        },
        /**
         * 变化选区
         * @method _selectionChange
         * @private
         */
        _selectionChange: function (delay, evt) {
            var me = this;
            //有光标才做selectionchange 为了解决未focus时点击source不能触发更改工具栏状态的问题（source命令notNeedUndo=1）
//            if ( !me.selection.isFocus() ){
//                return;
//            }


            var hackForMouseUp = false;
            var mouseX, mouseY;
            if (browser.ie && browser.version < 9 && evt && evt.type == 'mouseup') {
                var range = this.selection.getRange();
                if (!range.collapsed) {
                    hackForMouseUp = true;
                    mouseX = evt.clientX;
                    mouseY = evt.clientY;
                }
            }
            clearTimeout(_selectionChangeTimer);
            _selectionChangeTimer = setTimeout(function () {
                if (!me.selection || !me.selection.getNative()) {
                    return;
                }
                //修复一个IE下的bug: 鼠标点击一段已选择的文本中间时，可能在mouseup后的一段时间内取到的range是在selection的type为None下的错误值.
                //IE下如果用户是拖拽一段已选择文本，则不会触发mouseup事件，所以这里的特殊处理不会对其有影响
                var ieRange;
                if (hackForMouseUp && me.selection.getNative().type == 'None') {
                    ieRange = me.document.body.createTextRange();
                    try {
                        ieRange.moveToPoint(mouseX, mouseY);
                    } catch (ex) {
                        ieRange = null;
                    }
                }
                var bakGetIERange;
                if (ieRange) {
                    bakGetIERange = me.selection.getIERange;
                    me.selection.getIERange = function () {
                        return ieRange;
                    };
                }
                me.selection.cache();
                if (bakGetIERange) {
                    me.selection.getIERange = bakGetIERange;
                }
                if (me.selection._cachedRange && me.selection._cachedStartElement) {
                    me.fireEvent('beforeselectionchange');
                    // 第二个参数causeByUi为true代表由用户交互造成的selectionchange.
                    me.fireEvent('selectionchange', !!evt);
                    me.fireEvent('afterselectionchange');
                    me.selection.clear();
                }
            }, delay || 50);
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
            cmd = this.commands[cmdName] || JT.commands[cmdName];
            cmdFn = cmd && cmd[fnName];
            //没有querycommandstate或者没有command的都默认返回0
            if ((!cmd || !cmdFn) && fnName == 'queryCommandState') {
                return 0;
            } else if (cmdFn) {
                return cmdFn.apply(this, args);
            }
        },

        /**
         * 执行编辑命令cmdName，完成富文本编辑效果
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
                cmd = me.commands[cmdName] || JT.commands[cmdName];
            if (!cmd || !cmd.execCommand) {
                return null;
            }
//            result = this._callCmdFn('execCommand', arguments);
            if (!cmd.notNeedUndo && !me.__hasEnterExecCommand) {
                me.__hasEnterExecCommand = true;
                if (me.queryCommandState.apply(me,arguments) != -1) {
                    me.fireEvent('saveScene');
                    me.fireEvent.apply(me, ['beforeexeccommand', cmdName].concat(arguments));
                    result = this._callCmdFn('execCommand', arguments);
                    //保存场景时，做了内容对比，再看是否进行contentchange触发，这里多触发了一次，去掉
//                    (!cmd.ignoreContentChange && !me._ignoreContentChange) && me.fireEvent('contentchange');
                    me.fireEvent.apply(me, ['afterexeccommand', cmdName].concat(arguments));
                    me.fireEvent('saveScene');
                }
                me.__hasEnterExecCommand = false;
            } else {
                result = this._callCmdFn('execCommand', arguments);
                (!me.__hasEnterExecCommand && !cmd.ignoreContentChange && !me._ignoreContentChange) && me.fireEvent('contentchange')
            }
            (!me.__hasEnterExecCommand && !cmd.ignoreContentChange && !me._ignoreContentChange) && me._selectionChange();
            return result;
        },

        /**
         * 根据传入的command命令，查选编辑器当前的选区，返回命令的状态
         * @method  queryCommandState
         * @param { String } cmdName 需要查询的命令名称
         * @remind 具体命令的使用请参考<a href="#COMMAND.LIST">命令列表</a>
         * @return { Number } number 返回放前命令的状态，返回值三种情况：(-1|0|1)
         * @example
         * ```javascript
         * editor.queryCommandState(cmdName)  => (-1|0|1)
         * ```
         * @see COMMAND.LIST
         */
        queryCommandState: function (cmdName) {
            return this._callCmdFn('queryCommandState', arguments);
        },

        /**
         * 根据传入的command命令，查选编辑器当前的选区，根据命令返回相关的值
         * @method queryCommandValue
         * @param { String } cmdName 需要查询的命令名称
         * @remind 具体命令的使用请参考<a href="#COMMAND.LIST">命令列表</a>
         * @remind 只有部分插件有此方法
         * @return { * } 返回每个命令特定的当前状态值
         * @grammar editor.queryCommandValue(cmdName)  =>  {*}
         * @see COMMAND.LIST
         */
        queryCommandValue: function (cmdName) {
            return this._callCmdFn('queryCommandValue', arguments);
        },

        /**
         * 重置编辑器，可用来做多个tab使用同一个编辑器实例
         * @method  reset
         * @remind 此方法会清空编辑器内容，清空回退列表，会触发reset事件
         * @example
         * ```javascript
         * editor.reset()
         * ```
         */
        reset: function () {
            this.fireEvent('reset');
        },

        /**
         * 设置当前编辑区域可以编辑
         * @method setEnabled
         * @example
         * ```javascript
         * editor.setEnabled()
         * ```
         */
        setEnabled: function () {
            var me = this, range;
            if (me.body.contentEditable == 'false') {
                me.body.contentEditable = true;
                range = me.selection.getRange();
                //有可能内容丢失了
                try {
                    range.moveToBookmark(me.lastBk);
                    delete me.lastBk
                } catch (e) {
                    range.setStartAtFirst(me.body).collapse(true)
                }
                range.select(true);
                if (me.bkqueryCommandState) {
                    me.queryCommandState = me.bkqueryCommandState;
                    delete me.bkqueryCommandState;
                }
                if (me.bkqueryCommandValue) {
                    me.queryCommandValue = me.bkqueryCommandValue;
                    delete me.bkqueryCommandValue;
                }
                me.fireEvent('selectionchange');
            }
        },
        enable: function () {
            return this.setEnabled();
        },

        /** 设置当前编辑区域不可编辑
         * @method setDisabled
         */

        /** 设置当前编辑区域不可编辑,except中的命令除外
         * @method setDisabled
         * @param { String } except 例外命令的字符串
         * @remind 即使设置了disable，此处配置的例外命令仍然可以执行
         * @example
         * ```javascript
         * editor.setDisabled('bold'); //禁用工具栏中除加粗之外的所有功能
         * ```
         */

        /** 设置当前编辑区域不可编辑,except中的命令除外
         * @method setDisabled
         * @param { Array } except 例外命令的字符串数组，数组中的命令仍然可以执行
         * @remind 即使设置了disable，此处配置的例外命令仍然可以执行
         * @example
         * ```javascript
         * editor.setDisabled(['bold','insertimage']); //禁用工具栏中除加粗和插入图片之外的所有功能
         * ```
         */
        setDisabled: function (except) {
            var me = this;
            except = except ? utils.isArray(except) ? except : [except] : [];
            if (me.body.contentEditable == 'true') {
                if (!me.lastBk) {
                    me.lastBk = me.selection.getRange().createBookmark(true);
                }
                me.body.contentEditable = false;
                me.bkqueryCommandState = me.queryCommandState;
                me.bkqueryCommandValue = me.queryCommandValue;
                me.queryCommandState = function (type) {
                    if (utils.indexOf(except, type) != -1) {
                        return me.bkqueryCommandState.apply(me, arguments);
                    }
                    return -1;
                };
                me.queryCommandValue = function (type) {
                    if (utils.indexOf(except, type) != -1) {
                        return me.bkqueryCommandValue.apply(me, arguments);
                    }
                    return null;
                };
                me.fireEvent('selectionchange');
            }
        },
        disable: function (except) {
            return this.setDisabled(except);
        },

        /**
         * 设置默认内容
         * @method _setDefaultContent
         * @private
         * @param  { String } cont 要存入的内容
         */
        _setDefaultContent: function () {
            function clear() {
                var me = this;
                if (me.document.getElementById('initContent')) {
                    me.body.innerHTML = '<p>' + (ie ? '' : '<br/>') + '</p>';
                    me.removeListener('firstBeforeExecCommand focus', clear);
                    setTimeout(function () {
                        me.focus();
                        me._selectionChange();
                    }, 0)
                }
            }

            return function (cont) {
                var me = this;
                me.body.innerHTML = '<p id="initContent">' + cont + '</p>';

                me.addListener('firstBeforeExecCommand focus', clear);
            }
        }(),

        /**
         * 显示编辑器
         * @method setShow
         * @example
         * ```javascript
         * editor.setShow()
         * ```
         */
        setShow: function () {
            var me = this, range = me.selection.getRange();
            if (me.container.style.display == 'none') {
                //有可能内容丢失了
                try {
                    range.moveToBookmark(me.lastBk);
                    delete me.lastBk
                } catch (e) {
                    range.setStartAtFirst(me.body).collapse(true)
                }
                //ie下focus实效，所以做了个延迟
                setTimeout(function () {
                    range.select(true);
                }, 100);
                me.container.style.display = '';
            }

        },
        show: function () {
            return this.setShow();
        },
        /**
         * 隐藏编辑器
         * @method setHide
         * @example
         * ```javascript
         * editor.setHide()
         * ```
         */
        setHide: function () {
            var me = this;
            if (!me.lastBk) {
                me.lastBk = me.selection.getRange().createBookmark(true);
            }
            me.container.style.display = 'none'
        },
        hide: function () {
            return this.setHide();
        },

        /**
         * 根据指定的路径，获取对应的语言资源
         * @method getLang
         * @param { String } path 路径根据的是lang目录下的语言文件的路径结构
         * @return { Object | String } 根据路径返回语言资源的Json格式对象或者语言字符串
         * @example
         * ```javascript
         * editor.getLang('contextMenu.delete'); //如果当前是中文，那返回是的是'删除'
         * ```
         */
        getLang: function (path) {
            var lang = UE.I18N[this.options.lang];
            if (!lang) {
                throw Error("not import language file");
            }
            path = (path || "").split(".");
            for (var i = 0, ci; ci = path[i++];) {
                lang = lang[ci];
                if (!lang)break;
            }
            return lang;
        },

        /**
         * 注册输入过滤规则
         * @method  addInputRule
         * @param { Function } rule 要添加的过滤规则
         * @example
         * ```javascript
         * editor.addInputRule(function(root){
         *   $.each(root.getNodesByTagName('div'),function(i,node){
         *       node.tagName="p";
         *   });
         * });
         * ```
         */
        addInputRule: function (rule) {
            this.inputRules.push(rule);
        },

        /**
         * 执行注册的过滤规则
         * @method  filterInputRule
         * @param { UE.uNode } root 要过滤的uNode节点
         * @remind 执行editor.setContent方法和执行'inserthtml'命令后，会运行该过滤函数
         * @example
         * ```javascript
         * editor.filterInputRule(editor.body);
         * ```
         * @see UE.Editor:addInputRule
         */
        filterInputRule: function (root) {
            for (var i = 0, ci; ci = this.inputRules[i++];) {
                ci.call(this, root)
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
         * 根据输出过滤规则，过滤编辑器内容
         * @method  filterOutputRule
         * @remind 执行editor.getContent方法的时候，会先运行该过滤函数
         * @param { UE.uNode } root 要过滤的uNode节点
         * @example
         * ```javascript
         * editor.filterOutputRule(editor.body);
         * ```
         * @see UE.Editor:addOutputRule
         */
        filterOutputRule: function (root) {
            for (var i = 0, ci; ci = this.outputRules[i++];) {
                ci.call(this, root)
            }
        }
    };
    utils.inherits(Table, EventBase);
})();
