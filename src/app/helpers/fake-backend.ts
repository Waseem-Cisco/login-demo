import { Http, BaseRequestOptions, Response, ResponseOptions, RequestMethod } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
 
export function fakeBackendFactory(backend: MockBackend, options: BaseRequestOptions) {

    let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlN1cmVzaCBWZWx1c3dhbXkiLCJpYXQiOjE1MTYyMzkwMjJ9.DywWTI_7b-43JMDyEcCbSK-yybLupD-yT0EIYvlK_kY';

    backend.connections.subscribe((connection: MockConnection) => {
      // We are using the setTimeout() function to simulate an asynchronous call 
      // to the server that takes 1 second. 
      setTimeout(() => {
        //
        // Fake implementation of /api/authenticate
        //
        if (connection.request.url.endsWith('/api/authenticate') && 
            connection.request.method === RequestMethod.Post) {
            let body = JSON.parse(connection.request.getBody());

            if (body.email === 'suresh.veluswamy@harman.com' && body.password === '1234') {
              connection.mockRespond(new Response(
                new ResponseOptions({ 
                  status: 200, 
                  body: { token: token }
                })
              ));
            } else {
              connection.mockRespond(new Response(
                new ResponseOptions({ status: 400 })
              ));
            }
        }
    
      }, 1000);
    });
 
    return new Http(backend, options);
}
 
export let fakeBackendProvider = {
    provide: Http,
    useFactory: fakeBackendFactory,
    deps: [MockBackend, BaseRequestOptions]
};