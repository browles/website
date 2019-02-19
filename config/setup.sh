#!/usr/bin/env bash

set -eu -o pipefail -o xtrace

sudo add-apt-repository ppa:certbot/certbot
sudo apt-get update

# Nginx
sudo apt-get -y install nginx
sudo mkdir -p /var/www/benrowles.com/logs
sudo cp nginx/benrowles.com /etc/nginx/sites-available
if [ ! -L /etc/nginx/sites-enabled/benrowles.com ]
then
    sudo ln -s /etc/nginx/sites-available/benrowles.com /etc/nginx/sites-enabled/benrowles.com
fi

if [ ! -L /var/www/benrowles.com/public ]
then
    sudo ln -sT /home/ubuntu/src/website/public /var/www/benrowles.com/public
fi

# Let's Encrypt
if [ ! -f /usr/bin/certbot ]
then
    sudo apt-get update
    sudo apt-get install software-properties-common
    sudo add-apt-repository universe
    sudo add-apt-repository ppa:certbot/certbot
    sudo apt-get update
    sudo apt-get install certbot python-certbot-nginx
fi

if [ ! -f /etc/systemd/system/certbot.service ]
then
    sudo certbot --nginx -d benrowles.com -d www.benrowles.com
    sudo cp systemd/* /etc/systemd/system
    sudo systemctl enable certbot
fi

# Restart nginx
sudo service nginx restart
