import Vue from 'vue'
import Router from 'vue-router'

import showBlogs from '../components/blogs/showBlogs'
import addBlog from '../components/blogs/addBlog';
import editBlog from '../components/blogs/editBlog';
import singleBlog from '../components/blogs/singleBlog';
import signup from '../components/users/signup';
import signin from '../components/users/signin';
import editCategory from '../components/categories/editCategory';
import editTag from '../components/tags/editTag';
import Error404 from '../components/Error404';
import AuthGuard from './auth-guard';


// Set-up and use the Vue Router
// Pass in your routes and then
// Set the mode to use history
// removes # from the URL
Vue.use(Router);

export default new Router(
    {
    routes: [
        { path: '/', component: showBlogs },
        { path: '/add', component: addBlog, beforeEnter: AuthGuard},
        { path: '/edit/:id', component: editBlog, beforeEnter: AuthGuard},
        { path: '/blog/:id', component: singleBlog },
        { path: '/signup', component: signup},
        { path: '/signin', component: signin},
        { path: '/editCategory',component:editCategory, beforeEnter: AuthGuard },
        { path: '/editTag',component:editTag, beforeEnter: AuthGuard },
        { path: '/404', name: '404', component: Error404 },
        { path: '*', redirect: '/404' }
    ],
    mode : 'history'
    }
)