# Kaulytter - Back

## Overview

Backend of the kaulytter project. Here we have a simple but useful backend. I choose Heroku as host, Mlab for the database and Cloudinary to host the photos. I wanted the project look like a real production project and that's why I choose that services stack.

## Features

- Authentication
- Push notifications
- Protected routes
- Image upload
- CRUD

## Installation

To run this project, execute the follow commands:

```
git clone https://github.com/kauly/kaulytter-back.git
```

```
cd kaulytter-back
```

Now create a .env file with the follows variables.

```
touch .env
```

```
DB_URI = 'mongo uri'
SECRET = 'webtoken secret'
PORT = optional
CLOUD_NAME = '***'
CLOUD_KEY = '***'
CLOUD_SECRET = '***'
```

```
yarn
```

```
yarn run dev
```
