import showBlogs from './components/showBlogs.vue';
import addBlog from './components/addBlog.vue';
import singleBlog from './components/singleBlog.vue';
import signup from './components/users/signup.vue';
import signin from './components/users/signin.vue';
import editCategory from './components/categories/editCategory';
import editTag from './components/tags/editTag';
import Error404 from './components/Error404.vue';

export default [
    { path:'/', component: showBlogs },
    { path:'/add', component: addBlog, meta: {requiresAuth: true } },
    { path:'/blog/:id', component: singleBlog },
    { path: '/signup', component: signup},
    { path: '/signin', component: signin},
    { path: '/editCategory',component:editCategory, meta: {requiresAuth: true } },
    { path: '/editTag',component:editTag, meta: {requiresAuth: true } },
    { path: '/404', name: '404', component: Error404 },
    { path: '*', redirect: '/404' }
]