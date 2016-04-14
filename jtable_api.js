/**
 * 开发版本的文件导入
 */
(function (){
    var paths  = [
            // 'jtable.js'
            // ,'core/EventBase.js'
            // ,'ui/uiutils.js'
            // ,'core/utils.js'
            // ,'core/uibase.js'
            //
            //
            //
            // ,'core/Table.js'
            // ,'adapter/jtable.js'


            'jtable.js',
            'core/browser.js',
            'core/utils.js',
            'core/EventBase.js',
            'core/dtd.js',
            'core/domUtils.js',
            'core/Range.js',
            'core/Selection.js',
            'core/Table.js',
            //'core/Editor.defaultoptions.js',
            //'core/loadconfig.js',
            //'core/ajax.js',
            //'core/filterword.js',
            'core/node.js',
            //'core/htmlparser.js',
            //'core/filternode.js',
            'core/plugin.js',
           // 'core/keymap.js',
            //'core/localstorage.js',

             'plugins/inserthtml.js',
             'plugins/table.core.js',
             'plugins/table.cmds.js',
             'plugins/table.action.js',
            // 'plugins/table.sort.js',
            // 'plugins/contextmenu.js',
            // 'plugins/shortcutmenu.js',

            //'ui/ui.js',
            'ui/uiutils.js',
            'ui/uibase.js',
            //'ui/separator.js',
            //'ui/mask.js',
            'ui/popup.js',
            //'ui/colorpicker.js',
            //'ui/tablepicker.js',
            //'ui/stateful.js',
            //'ui/button.js',
            //'ui/splitbutton.js',
            //'ui/tablebutton.js',
            //'ui/cellalignpicker.js',

            // 'ui/menu.js',
            // 'ui/combox.js',
            // 'ui/dialog.js',
            // 'ui/menubutton.js',
            // 'ui/multiMenu.js',
            // 'ui/shortcutmenu.js',


            //'adapter/editorui.js',
            'adapter/jtable.js'

        ],
        baseURL = '../src/';
    for (var i=0,pi;pi = paths[i++];) {
        document.write('<script type="text/javascript" src="'+ baseURL + pi +'"></script>');
    }
})();
