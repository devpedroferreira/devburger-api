/*
metodos que vamos usa:

store => cadastrar/add
index => Listar varios
show => mostrar um
update => atualizar
delete => delete
*/

class UserController {
    async store(req, res) {
        try {
            const user = await User.create({
                id: v4(),
                name: 'Pedro',
                email: 'pedro@email.com',
                password_hash: '123123',
            });
            return res.status(201).json(user);
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({ error: 'Email already exists' });
            }
            return res.status(500).json({ error: 'Internal server error' });
        }  
    }
}