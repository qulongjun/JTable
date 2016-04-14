/**
 * Created by qulongjun on 16/4/13.
 */

window.JTABLE_CONFIG = {
    container: ""
    , tdWidth: "50"
    , tdHeight: "50"
    , tdAligin: "center"
};
var uid = 0;
var JTable = JT.JTable = function (options) {
    var me = this;
    me.uid = uid++;
    me.options;

};
JTable.prototype = {
  render:function () {
      
  }  
};
var JUtils=JT.JUtils=function () {
    
};
JUtils.prototype={
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
     * UE.utils.extend( target, source, true );
     *
     * //output: { name: 'target', sex: 1, age: 17 }
     * console.log( target );
     *
     * ```
     */
    extend:function (t, s, b) {
        if (s) {
            for (var k in s) {
                if (!b || !t.hasOwnProperty(k)) {
                    t[k] = s[k];
                }
            }
        }
        return t;
    }
};
window.JT=JT;


