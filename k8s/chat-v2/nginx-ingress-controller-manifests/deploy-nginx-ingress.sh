#!/usr/bin/bash

# just a generator with easy version editing
deploychart(){
    APP_VERSION="1.8.0"
    CHART_VERSION="4.7.0"   
    
    helm template ingress-nginx ingress-nginx --repo https://kubernetes.github.io/ingress-nginx --version ${CHART_VERSION} --namespace ingress-nginx > ../01-nginx-ingress.${APP_VERSION}.yaml
}

deploychart