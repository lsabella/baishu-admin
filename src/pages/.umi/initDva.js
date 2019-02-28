import dva from 'dva';
import createLoading from 'dva-loading';

const runtimeDva = window.g_plugins.mergeConfig('dva');
let app = dva({
  history: window.g_history,
  
  ...(runtimeDva.config || {}),
});

window.g_app = app;
app.use(createLoading());
(runtimeDva.plugins || []).forEach(plugin => {
  app.use(plugin);
});

app.model({ namespace: 'global', ...(require('/Users/user18/baishu_front/baishu-admin/baishu-admin/src/models/global.js').default) });
app.model({ namespace: 'list', ...(require('/Users/user18/baishu_front/baishu-admin/baishu-admin/src/models/list.js').default) });
app.model({ namespace: 'login', ...(require('/Users/user18/baishu_front/baishu-admin/baishu-admin/src/models/login.js').default) });
app.model({ namespace: 'menu', ...(require('/Users/user18/baishu_front/baishu-admin/baishu-admin/src/models/menu.js').default) });
app.model({ namespace: 'project', ...(require('/Users/user18/baishu_front/baishu-admin/baishu-admin/src/models/project.js').default) });
app.model({ namespace: 'setting', ...(require('/Users/user18/baishu_front/baishu-admin/baishu-admin/src/models/setting.js').default) });
app.model({ namespace: 'user', ...(require('/Users/user18/baishu_front/baishu-admin/baishu-admin/src/models/user.js').default) });
