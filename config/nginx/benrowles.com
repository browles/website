server {
	listen   80;
	server_name *.amazonaws.com;

	access_log /var/www/benrowles.com/logs/access.log;
	error_log /var/www/benrowles.com/logs/error.log;

	location / {
		root   /var/www/benrowles.com/public/;
		index  index.html;
	}
}

server {
	listen   80;
	server_name www.benrowles.com;
	rewrite ^/(.*) http://benrowles.com/$1 permanent;

    listen 443 ssl; # managed by Certbot
ssl_certificate /etc/letsencrypt/live/benrowles.com/fullchain.pem; # managed by Certbot
ssl_certificate_key /etc/letsencrypt/live/benrowles.com/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot


    # Redirect non-https traffic to https
    # if ($scheme != "https") {
    #     return 301 https://$host$request_uri;
    # } # managed by Certbot

}

server {
	listen   80;
	server_name benrowles.com;

	access_log /var/www/benrowles.com/logs/access.log;
	error_log /var/www/benrowles.com/logs/error.log;

	location / {
		root   /var/www/benrowles.com/public/;
		index  index.html;
	}

    listen 443 ssl; # managed by Certbot
ssl_certificate /etc/letsencrypt/live/benrowles.com/fullchain.pem; # managed by Certbot
ssl_certificate_key /etc/letsencrypt/live/benrowles.com/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot


    if ($scheme != "https") {
        return 301 https://$host$request_uri;
    } # managed by Certbot

}
