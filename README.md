# ft_trascendence

# Transcendence-Api-schema
[Diagram-transcendence.pdf](https://github.com/Wowbagger1994/ft_trascendence/files/10609904/Diagram-transcendence.pdf)

# DOCKERIZATION:

- Per aggiungere nuove dipendenze installarle direttamente all'interno del container.
  I file package sono linkati con quelli della macchina host e di conseguenza non sarà
  necessario aggiornarli manualmente.

  Per accedere ai containers:
	- (backend) docker exec -it backend sh
	- (frontend) docker exec -it frontend sh
