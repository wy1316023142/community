import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import filter from './commom/filter.js'
import './registerServiceWorker';
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import VueAMap from 'vue-amap';
Vue.use(VueAMap);
Vue.use(ElementUI)
Vue.use(filter)
Vue.config.productionTip = false;
// 初始化vue-amap
VueAMap.initAMapApiLoader({
  // 高德的key
  key: 'YOUR_KEY',
  // 插件集合
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor', 'Geolocation'],
  // 高德 sdk 版本，默认为 1.4.4
  v: '1.4.4'
});

Vue.directive('allow', {
  inserted: (el, binding, vnode)=> {
    if(JSON.parse(sessionStorage.getItem('authorities')).indexOf(binding.value+'')==-1){
      el.parentNode.removeChild(el)
    }
  }

});
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
