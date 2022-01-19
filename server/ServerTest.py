from Config import *
from model.User import User
from model.Stock import Stock
from model.UserStock import UserStock


def reiniciaBanco():
    # Apagar arquivo do banco
    if os.path.exists(DB_FILE):
        os.remove(DB_FILE)

    # Criar tabelas
    db.create_all()


def testUser():
    print('######### Testando "TestUser" #########')
    reiniciaBanco()
    try:
        # Criar um usuário
        user = User(login="nfcunha", pwd="123", email="teste@gmail.com", person_name="Nicolas Filipe Cunha")
        print(user.to_json())
        db.session.add(user)
        db.session.commit()
        # Tentar buscar usuário novamente
        user_test = db.session.query(User).filter(User.login == "nfcunha").first()
        if user_test:
            print(user_test.to_json())
    except Exception as ex:
        print('Teste "TestUser"... falhou!"')
        print('Erro: ' + str(ex))

    print('Teste "TestUser"... OK"')


def testStock():
    print('######### Testando "TestStock" #########')
    reiniciaBanco()
    try:
        # Criar uma ação
        stock = Stock(name='ITAU', code='ITAUSA4', price=10)
        print(stock.to_json())
        db.session.add(stock)
        db.session.commit()
        # Tentar buscar ação novamente
        stock_test = db.session.query(Stock).filter(Stock.code == 'ITAUSA4').first()

        if stock_test:
            print(stock.to_json())
    except Exception as ex:
        print('Teste "TestStock"... falhou!"')
        print('Erro: ' + str(ex))

    print('Teste "TestStock"... OK"')


if __name__ == '__main__':
    testUser()
    testStock()
    # testUserStock()
