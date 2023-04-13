NAME = ft_trascendence

ND		= \033[0m
RED		= \033[31m
GREEN	= \033[32m
CYAN	= \033[36m

all:
	@ if [ -d ./frontend/node_modules ]; then echo "${RED}frotend node_modules${ND} already exist.\n${CYAN}Recreating it${ND}"; rm -rf ./frontend/node_modules ; else echo "${GREEN}frontend node_modules${ND} does not exist\n${CYAN}Creating it${ND}"; fi
	@ mkdir ./frontend/node_modules
	@ if [ -d ./backend/node_modules ]; then echo "${RED}backend node_modules${ND} already exist.\n${CYAN}Recreating it${ND}"; rm -rf ./backend/node_modules ; else echo "${GREEN}backend node_modules${ND} does not exist\n${CYAN}Creating it${ND}"; fi
	@ mkdir ./backend/node_modules
	@ docker-compose -f docker-compose.yml up --build

stop:
	@ docker-compose -f docker-compose.yml down
	@ rm -rf ./frontend/node_modules
	@ rm -rf ./backend/node_modules

# Elimina containers e file immagine
clean: stop
	@ docker system prune -a -f

# Elimina anche i volumi creati
prune: clean
	@ docker volume rm $$(docker volume ls -qf dangling=true)

re: clean
	@ docker-compose -f docker-compose.yml up --build


# SERVIZI SINGOLI

frontend: .FORCE
	@ if [ -d ./frontend/node_modules ]; then echo "${RED}frotend node_modules${ND} already exist.\n${CYAN}Recreating it${ND}"; rm -rf ./frontend/node_modules ; else echo "${GREEN}frontend node_modules${ND} does not exist\n${CYAN}Creating it${ND}"; fi
	@ mkdir ./frontend/node_modules
	@ docker-compose -f docker-compose.yml up --no-deps frontend

backend: .FORCE
	@ if [ -d ./backend/node_modules ]; then echo "${RED}backend node_modules${ND} already exist.\n${CYAN}Recreating it${ND}"; rm -rf ./backend/node_modules ; else echo "${GREEN}backend node_modules${ND} does not exist\n${CYAN}Creating it${ND}"; fi
	@ mkdir ./backend/node_modules
	@ docker-compose -f docker-compose.yml up postgres backend

postgres: .FORCE
	@ docker-compose -f docker-compose.yml up --no-deps postgres


.FORCE:

.PHONY: stop clean prune re all frontend backend postgres
