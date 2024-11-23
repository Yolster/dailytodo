# Daily To Do

I create this website for reload my nodejs knowledge. This website allows create a daily to do list.


## MySql

You can create random db and just change app.js mysql connection.

```http
  users table
```

| id | username     | email     | password |
| :-------- | :------- | :------- | :------- |
| `INTEGER AUTO_INCREMENT` | `string` | `string` | `string` |

The password will be encrypted automatically

#### Get item

```http
  todos table
```

| id | userID     | todo     | finished | date |
| :-------- | :------- | :------- | :------- | :------- |
| `integer AUTO_INCREMENT` | `integer` | `string` | `string` |`string` |

**Note:** If todos table has an error change *userID* to string. 

## Tech Stack

**Client:** EJS

**Server:** Node, Express, MySql


## Running Tests

To run tests, run the following command

```bash
  node app.js
```


## Authors

- [@yolster](https://www.github.com/Yolster)
## Badges

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

[![NodeJS](https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white)](https://nodejs.org/en)

[![mysql]([https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white))](https://nodejs.org/en)
