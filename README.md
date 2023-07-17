Det pet project lyeth hier.

Usually ran with k3s and Nginx Ingress controller.
Used helm charts: [kube-prometheus-stack](https://prometheus-community.github.io/helm-charts ), [bitnami metrics](https://charts.bitnami.com/bitnami), [nginx ingress](https://kubernetes.github.io/ingress-nginx), [nfs-subdir-external-provisioner](https://kubernetes-sigs.github.io/nfs-subdir-external-provisioner/), [jetstack cert-manager](https://charts.jetstack.io).


TBA: ~~metrics, monitoring manifests, edit endpoint in 5/00, bitnami metrics chart, Helm chart version of the app, add kps to the helm chart version, TLS cert~~, RBAC, ansible playbook for running everything, Ceph, zero downtime, edit flux.

TBA2: the same but with a wordpress mysql/postgres app.