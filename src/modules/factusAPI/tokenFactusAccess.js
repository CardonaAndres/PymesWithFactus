import fetch from 'node-fetch';
import { factusConfig } from '../../configs/config.js';

export const getTokenAccess = async () => {
    try {

        const res = await fetch(`${factusConfig.URL_BASE}/oauth/token`, { 
            method: 'POST', headers: { 'Accept': 'application/json', },     
            body: new URLSearchParams({
                grant_type: factusConfig.GRANT_TYPE,
                client_id: factusConfig.CLIENT_ID,
                client_secret: factusConfig.CLIENT_SECRET,
                username: factusConfig.USERNAME,
                password: factusConfig.PASSWORD,
            })
        });

        const data = await res.json();

        if (!res.ok) throw new Error(`Error en la solicitud: ${res.statusText}`);

        return data.access_token;
          
    } catch (err) {
        throw err;
    }
}