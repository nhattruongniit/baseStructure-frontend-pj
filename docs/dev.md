# Commands

NPM's commands: `npm run <command name>`. VD: `npm run js:minify`


| Command             | Description                                                                                           |
|---------------------|-------------------------------------------------------------------------------------------------------|
| `js:concat`         | Nối các file JS thành 1 file                                                                          |
| `js:concat:watch`   | Theo dõi thay đổi của các file JS. Nếu có thay đổi sẽ chạy lệnh `js:concat`                           |
| `js:minify`         | Nén file được sinh ra bởi lệnh `js:concat`                                                            |
| `js:minify:watch`   | Theo dõi thay đổi của file sinh ra bởi lệnh `js:minify`. Nếu có thay đổi sẽ chạy lại lệnh `js:minify` |
| `js`                | Chạy các lệnh `js:concat` và `js:minify`                                                              |
| `js:watch`          | Chạy các lệnh `js:concat:watch` và `js:minify:watch`                                                  |
| `css:compile`       | Compile các file sass thành css                                                                       |
| `css:compile:watch` | Theo dõi các file sass. Nếu có thay đổi sẽ chạy lệnh `css:compile`                                    |
| `css:minify`        | Nén file css được sinh ra từ lệnh `css:compile`                                                       |
| `css:minify:watch`  | Theo dõi file css được sinh ra từ lệnh `css:compile`. Nếu có thay đổi sẽ chạy lệnh `css:minify`       |
| `css`               | Chạy các lệnh `css:compile` và `css:minify`                                                           |
| `css:watch`         | Chạy các lệnh `css:compile:watch` và `css:minify:watch`                                               |
| `html:compile`      | Compile pug files thành file HTML                                                                     |
| `html:watch`        | Theo dõi các file pug. Nếu có thay đổi sẽ chạy lệnh `html:compile`                                    |
| `html`              | Alias của lệnh `html:compile`                                                                         |
| `watch`             | Chạy các lệnh `js:watch`, `css:watch` và `html:watch`                                                 |
| `serve`             | Chạy live server. Các thay đổi của JS, CSS và HTML sẽ tự động update                                  |
| `build`             | Chạy các lệnh `js`, `css` và `html`                                                                   |
