import showBlogs from './components/showBlogs.vue';
import addBlog from './components/addBlog.vue';
import singleBlog from './components/singleBlog.vue';
import signup from './components/users/signup.vue';

export default [
    { path:'/', component: showBlogs },
    { path:'/add', component: addBlog },
    { path:'/blog/:id', component: singleBlog },
    { path: '/signup', component: signup}
]