const router = require('express').Router();
const { User, Post, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// get all users
router.get('/', (req, res) => {
  User.findAll({ attributes: { exclude: ['password'] } })
    .then(userData => {
      if (!userData) {
        res.status(404).json({ message: 'No users found' })
      }
      res.json(userData)
    })
    .catch(error => {
      console.log(error);
      res.status(500).json(error);
    });
})

// get one user by id
router.get('/:id', (req, res) => {
  User.findOne({
    attributes: { exclude: ['password'] },
    where: { id: req.params.id },
    include: [
      {
        model: Post,
        attributes: [
          'id',
          'title',
          'post_url',
          'posts_body',
          'created_at'
        ]
      },
      {
        model: Comment,
        attributes: ['id', 'comment_body', 'created_at'],
        include: {
          model: Post,
          attributes: [title]
        }
      }
    ]
  })
    .then(userData => {
      if (!userData) {
        res.status(404).json({ message: 'No user found with this id' });
        return;
      }
      res.json(userData);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json(error);
    });
})

// create user
router.post('/', (req, res) => {
  User.create({
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  })
    .then(userData => {
      req.session.save(() => {
        req.session.user_id = userData.id;
        req.session.name = userData.name;
        req.session.username = userData.username;
        req.session.loggedIn = true;

        res.json(userData);
      });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json(error);
    });
});

// user login
router.post('/login', (req, res) => {
  User.findOne({ where: { email: req.body.email } })
    .then(userData => {
      if (!userData) {
        res.status(400).json({ message: 'No user with that email address found!' });
        return;
      }

      const validPassword = userData.checkPassword(req.body.password);

      if (!validPassword) {
        res.status(400).json({ message: 'Incorrect password!' });
        return;
      }

      req.session.save(() => {
        req.session.user_id = userData.id;
        req.session.username = userData.username;
        req.session.loggedIn = true;

        res.json({ user: userData, message: 'Login successful!' });
      });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json(error)
    });
});

// user logout
router.post('/logout', (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  }
  else {
    alert("You are not logged in!").end();
  }
});

// update user by id
router.put('/:id', withAuth, (req, res) => {
  User.update(req.body, {
    individualHooks: true,
    where: { id: req.params.id }
  })
    .then(userData => {
      if (!userData[0]) {
        res.status(404).json({ message: 'No user found with this id' });
        return;
      }
      res.json(userData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// delete user by id
router.delete('/:id', withAuth, (req, res) => {
  User.destroy({ where: { id: req.params.id } })
    .then(userData => {
      if (!userData) {
        res.status(404).json({ message: 'No user found with this id' });
        return;
      }
      res.json(userData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;