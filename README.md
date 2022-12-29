# URL Shortener Microservice

This is the boilerplate code for the [URL Shortener Microservice project at freecodecamp.org](https://www.freecodecamp.org/learn/back-end-development-and-apis/back-end-development-and-apis-projects/url-shortener-microservice).

# Steps to run the code
1. First copy file `sample.env` and rename it into `.env`, and fill the `PORT=` with intended port where the api  will listen to, for example `PORT=8080`.
2. Open terminal, and navigate to the directory where this code is located, and run `npm install`.
3. After finished installing dependencies, run `npm start`.
4. To test the api, you can use browser or [Postman](https://www.postman.com/downloads/). Access the form to make a `POST` request at the root url, for example `http://localhost:8080/`, and then input the url to be shortened at the input, and then press `POST URL`.
5. To stop the api, type `Ctrl+C` in the terminal.

## API Description
This URL Shortener Microservice handle API Endpoint at `/api/shorturl`, the cases are:
1. If there is a `POST` request at `/api/shorturl` with url encoded data in the request body : `url=https://www.google.com` the response is :
```Javascript
{"original_url":"https://www.google.com","short_url":1}
```
2. If there is a `POST` request at `/api/shorturl` with url encoded data in the request body, but the url is without `http://` or `https://`, for example: : `url=www.google.com` the response is :
```Javascript
{"error":"Invalid URL"}
```
3. If there is a `POST` request at `/api/shorturl` which the request body contains invalid url which is unreachable by DNS, for example: : `url=https://www.dfdfddfddfjk.com` the response is :
```Javascript
{"error":"Invalid Hostname"}
```
4. If there is a `POST` request at `/api/shorturl` which the request body contains already shortened before by a `POST` request, for example in the case no. 1, `https://www.google.com` already shortened to `1`: `url=https://www.google.com` the response must be the same as before and the shortened url must not changed:
```Javascript
{"original_url":"https://www.google.com","short_url":1}
```
5. If there is a `POST` request at `/api/shorturl` with url encoded data in the request body, which the url is never shortened before, and this is the second url to be shortened after case no. 1, for example: `url=https://www.freecodecamp.org` the response is :
```Javascript
{"original_url":"https://www.freecodecamp.org","short_url":2}
```
6. If there is a url that is already shortened, for example case no. 1 and 5, if there is a `GET` request at `/api/shorturl/1` which is `1` is the shortened url for `https://www.google.com`, then the API automatically redirects to `https://www.google.com`.
7. If there is a `GET` request at `/api/shorturl/10` which is `10` is invalid shortened URL which is never been generated by the API, then the API responds with `JSON`:
```Javascript
{"error":"No short URL found for the given input"}
```