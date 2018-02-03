#!/usr/bin/env bash

set -eu -o pipefail -o xtrace

sudo add-apt-repository ppa:certbot/certbot
sudo apt-get update

# Nginx
sudo apt-get -y install nginx
sudo mkdir -p /var/www/benrowles.com
# sudo cp nginx/benrowles.com /etc/nginx/sites-available
# if [ ! -f /etc/nginx/sites-enabled/benrowles.com ]
# then
#     sudo ln -s /etc/nginx/sites-available/benrowles.com /etc/nginx/sites-enabled/benrowles.com
# fi

if [ ! -f /var/www/benrowles.com/public ]
then
   sudo ln -s /home/ubuntu/src/website/public /var/www/benrowles.com/public
fi



# Let's Encrypt
sudo apt-get install -y python-certbot-nginx
if [ ! -f /usr/bin/cerbot-auto ]
then
    sudo wget https://dl.eff.org/certbot-auto
    sudo chmod a+x certbot-auto
    sudo mv cerbot-auto /usr/bin
fi

sudo certbot-auto --nginx -d benrowles.com -d www.benrowles.com
sudo cp systemd/* /etc/systemd/system
sudo systemctl enable cerbot.timer

# Restart nginx
sudo service nginx restart
