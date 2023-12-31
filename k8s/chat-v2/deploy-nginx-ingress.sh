#!/usr/bin/bash

deploychart(){
    APP_VERSION="1.8.1"
    CHART_VERSION="4.7.1"   
    #mkdir nginx-ingress-controller-manifests && cd nginx-ingress-controller-manifests
    helm template ingress-nginx ingress-nginx --repo https://kubernetes.github.io/ingress-nginx --version ${CHART_VERSION} --namespace ingress-nginx > ./01-nginx-ingress.${APP_VERSION}.yaml
}

deploychart