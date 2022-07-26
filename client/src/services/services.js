import axios from 'axios';

axios.defaults.withCredentials = true;

const URL = 'http://localhost:7000/';

export const ForgotService = (email,recoveryToken) =>
axios.post(URL + 'forgot/',{
    email:email
});

export const RecoverService = (email,recoveryToken,password) =>
axios.post(URL + `recover/${email}/${recoveryToken}`,{
    password:password,
})

export const LoginService = (username,password) => 
axios.post(URL+'login',{
        'username':username,
        'password':password
})

export const SignUpService = (username, description, password, email) => 
    axios.post(URL+'signup',{
        'username':username,
        'description':description,
        'password':password,
        'email':email
})

export const UploadService = (formData)=>
    axios.post(URL + 'upload',formData, {'Content-Type': 'multipart/form-data' });

export const MediaService = (type='media',page=1,username='') =>
    axios.get(URL + `media/${type}/${page}/${username}`);

export const CommentsService = (index,page=1) =>
    axios.get(URL + `comment/${index}/${page}`);

export const SearchService = (type='search',page=1,search_param='') =>
    axios.post(URL + `media/${type}/${page}/${search_param}`);

export const GetMediaImage = (path) => URL+'images/'+path;

export const GetMediaData = (index) => axios.get(URL+'watch/'+index);

export const DeleteMediaDataWatch = (index) => axios.delete(URL+'watch/'+index);

export const ClearHistory = () => axios.get(URL+'clear/');

export const UpdateMedia = (name, description,index) => 
    axios.put(URL+'media/'+index,{
        'name':name,
        'description':description
})

export const HandleSubscribeService = (index) => axios.post(URL+`subscribe/${index}`,{'index':index});

export const DeleteMedia = (index) => axios.delete(URL+'media/'+index);
export const GetUserData = (username) => axios.post(URL+'user/',{username});
export const CheckPassword = (check_password) => axios.post(URL+'user/check',{check_password:check_password});

export const EditUser = (username, description, password, email) => 
    axios.post(URL+'user/edit',{
        'username':username,
        'description':description,
        'password':password,
        'email':email
})