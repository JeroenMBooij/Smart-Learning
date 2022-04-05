import * as lsKeys from 'src/app/common/constants/localstorage.constants';


export class SecurityClient 
{
    transformOptions(options) 
    {
        let jwt = localStorage.getItem(lsKeys.jwtTokenKey);
        if (jwt)
            options.headers = options.headers.append('authorization', jwt);
        else
        {
            let authCookie = this.getAuthCookie();
            if (authCookie)
            {
                jwt = authCookie;
                options.headers = options.headers.append('authorization', jwt);
            }
        }
        
        return Promise.resolve(options);
    }

    public getAuthCookie(): string
    {
        let cookies = document.cookie.split(';');
        for(let cookie of cookies)
        {
            let [key,value] = cookie.split('=');
            if(key == " authorization")
            {
                return value;
            }
        }

        return null;
    }
}