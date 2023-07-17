{{- define "metadata" -}}
name: {{ .Values.webapp.name | default "chat "}} # used to have -service/ingress suffix
namespace: {{ .Values.webapp.name | default "chat" }}
{{- end -}}