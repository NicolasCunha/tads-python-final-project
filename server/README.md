#### The following content is written in brazilian portuguese. If there is any need to understand this content in another language (english), please contact me via [e-mail](mailto:nicolascunha17@gmai.com) or [LinkedIn](https://www.linkedin.com/in/nicolasfcunha/).

### Avaliação final da matéria "Desenvolvimento de Sistemas em Python".

Essa pasta contém os arquivos da camada de servidor (back-end) da aplicação, utilizando Flask e SQLAlchemy. 

O projeto está estruturado da seguinte forma:

- [Server.py](Server.py): arquivo responsável por inicializar o servidor do Flask e criar as tabelas do banco que ainda não foram criadas através do SQL Alchemy.
- [Config.py](Config.py): arquivo que contém configurações do sistema, como porta do Flask e o diretório que o SQLAlchemy criará o arquivo do banco de dados.
- [utils](utils): módulo que contém arquivos utilitários, como o arquivo [HttpUtils](utils/HttpUtils.py) utilizada em conter constantes e métodos para padronizar criação de respostas dos endpoints.
- [model](model): módulo que contém classes mapeadas como Model do SQLAlchemy, representando o banco de dados.
- [service](service) : módulo que contém arquivos responsáveis pela regra de negócio das rotas. Por exemplo, a classe [UserService](service/UserService.py) contém métodos que efetuam a lógica para autenticação e cadastro do usuário.
- [endpoint](endpoint): módulo que contém arquivos responsáveis pelo mapeamento das rotas do Flask.
- [messages](messages): módulos que contém arquivos utiliários contendo constantes com expressões utilizadas para retorno de informações das rotas. Por exemplo, a classe [UserMessages](messages/UserMessages.py) contém expressões utilizadas como resposta quando o usuário já existe.

#### Módulos implementados:
- Usuário ([mapeamento de rota](endpoint/UserEndpoint.py), [regra de negócio](service/UserService.py), [modelo](model/User.py))
  - POST: Login
  - POST: Sign-Up

#### Módulos pendentes:
- Ação
  - POST: Criação de ações
  - DELETE: Remoção de ações
  - PUT: Atualização de ações
  - POST: Obtenção de ações (geral e por chave)

Para executar o lado do servidor do projeto, siga os passos abaixo:

* Instalar dependências do projeto pelo pip:
  * ```console
    pip install -r requirements.txt
    ```
* Executar o Python apontando para o arquivo [Server.py](Server.py):
  * ```console
    python Server.py
    ```
* Caso tudo ocorra corretamente, uma mensagem similar a esta será gerada no console:
  * ```console
    * Serving Flask app 'Config' (lazy loading)
    * Environment: production
      WARNING: This is a development server. Do not use it in a production deployment.
      Use a production WSGI server instead.
    * Debug mode: on
    * Restarting with stat
    * Debugger is active!
    * Debugger PIN: 949-775-630
    * Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)
    ```