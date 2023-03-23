NAME = ft_trascendence

all:
	@ docker-compose -f docker-compose.yml up --build

stop:
	@ docker-compose -f docker-compose.yml down

clean: stop
	@ docker system prune -a -f

prune: clean

	@ docker volume rm $$(docker volume ls -qf dangling=true)

re: clean
	@ docker-compose -f docker-compose.yml up --build

frontend: .FORCE
	@ docker-compose -f docker-compose.yml up --no-deps frontend

backend: .FORCE
	@ docker-compose -f docker-compose.yml up postgres backend

postgres: .FORCE
	@ docker-compose -f docker-compose.yml up --no-deps postgres


.FORCE:

.PHONY: stop clean prune re all frontend backend postgres
