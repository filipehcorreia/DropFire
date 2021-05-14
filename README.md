# DropFire
This platform allows the upload, download and deletion of files, for every authenticated user. It works using various technologies from Google Cloud such as:

 - Cloud SQL
 - Redis (with VPC)
 - Secret Manager (Gmail password)
 - Storage API
 - Load Balancer with CDN, pointing to the static files
 - Cloud DNS
 - Cloud Run (with VPC)

## How to Use
To run locally you will need a Redis instance running on port 81, and a Google Account logged in your local SDK with the correct configuration and technologies running.

After downloading run the following command:

    npm start

## Made by
Built in an academic purpose

 - [Filipe Correia](https://github.com/filipehcorreia) 
 - [Luís Meneses](https://github.com/ShorMeneses)
 - [Manuel Nunes](https://github.com/ManuelPNunes)
 - [Rui Neves](https://github.com/ruipsneves)
