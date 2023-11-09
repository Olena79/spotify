// Підключаємо технологію express для back-end сервера
const e = require('express')
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

class Track {
  static #list = []

  constructor(name, author, image) {
    this.id = Math.floor(1000 + Math.random() * 9000) // Випадкове id
    this.name = name
    this.author = author
    this.image = image
  }

  // Метод для створення об'єкту Track і додавання його до списку #list
  static create(name, author, image) {
    const newTrack = new Track(name, author, image)
    this.#list.push(newTrack)
    return newTrack
  }

  // Метод для отримання всього списку треків
  static getList() {
    return this.#list.reverse()
  }

  static getById(id) {
    return (
      Track.#list.find((track) => track.id === id) || null
    )
  }
}

Track.create(
  'Інь Ян',
  'MONATIC i ROXOLANA',
  'https://pictum.photos/100/100',
)

Track.create(
  'Два крыла',
  'Dabro',
  'https://pictum.photos/100/100',
)

Track.create(
  `I'd Rather Go Blind `,
  'Beyoncé',
  'https://pictum.photos/100/100',
)

Track.create(
  'Fallin`',
  'Alicia Keys',
  'https://pictum.photos/100/100',
)

Track.create(
  'Summertime',
  'Ella Fitzgerald',
  'https://pictum.photos/100/100',
)

Track.create(
  'Mad About You',
  'Hooverphonic ',
  'https://pictum.photos/100/100',
)

Track.create(
  'Roads',
  'Portishead',
  'https://pictum.photos/100/100',
)

Track.create(
  'Feeling Good',
  'Nina Simone',
  'https://pictum.photos/100/100',
)

Track.create(
  'Hit the Road Jack',
  'Ray Charles',
  'https://pictum.photos/100/100',
)

Track.create(
  'Human',
  `Rag'n'Bone Man`,
  'https://pictum.photos/100/100',
)

console.log(Track.getList())

// ================================================================

class Playlist {
  static #list = []

  constructor(name) {
    this.id = Math.floor(1000 + Math.random() * 9000) // Випадкове id
    this.name = name
    this.tracks = []
    this.image = 'https://pictum.photos/100/100'
  }

  // Метод для створення об'єкту Playlist і додавання його до списку #list
  static create(name) {
    const newPlaylist = new Playlist(name)
    this.#list.push(newPlaylist)
    return newPlaylist
  }

  // Метод для отримання всього списку плейлистів
  static getList() {
    return this.#list.reverse()
  }

  // Метод для отримання 3х рандомних трекiв
  static makeMix(playlist) {
    const allTracks = Track.getList()

    let randomTracks = allTracks
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)

    playlist.tracks.push(...randomTracks)
  }

  static getById(id) {
    return (
      Playlist.#list.find(
        (playlist) => playlist.id === id,
      ) || null
    )
  }

  addTrack(trackId) {
    const trackAdd = Playlist.getById(trackId)
    if (trackAdd) {
      this.tracks.push(trackAdd)
    }
  }

  deleteTrackById(trackId) {
    this.tracks = this.tracks.filter(
      (track) => track.id !== trackId,
    )
  }

  static findListByValue(name) {
    return this.#list.filter((playlist) =>
      playlist.name
        .toLowerCase()
        .includes(name.toLowerCase()),
    )
  }
}

Playlist.makeMix(Playlist.create('Улюблене'))
Playlist.makeMix(Playlist.create('Фітнес'))
Playlist.makeMix(Playlist.create('Для роботи'))
Playlist.makeMix(Playlist.create('Для відпочинку'))

// ================================================================

class Library {
  static #list = []

  constructor(name, playlist, playlistId, tracksCount) {
    this.name = name
    this.playlist = playlist
    this.playlistId = playlistId
    this.tracksCount = tracksCount
  }

  static addPlaylist(playlistId) {
    const playlistAdd = Playlist.getById(playlistId)
    this.#list.push(playlistAdd)
    return playlistAdd
  }

  static getList() {
    return this.#list.reverse()
  }

  deletePlaylistById(playlistId) {
    this.#list = this.#list.filter(
      (playlist) => playlist.id !== playlistId,
    )
  }
}

// ================================================================

router.get('/', function (req, res) {
  res.render('index', {
    style: 'index',

    data: {},
  })
})

// ================================================================

router.get('/spotify-choose', function (req, res) {
  res.render('spotify-choose', {
    style: 'spotify-choose',

    data: {},
  })
})

// ================================================================

router.get('/spotify-create', function (req, res) {
  const isMix = !!req.query.isMix

  console.log('isMix:', isMix)

  res.render('spotify-create', {
    style: 'spotify-create',

    data: {
      isMix,
    },
  })
})
// ================================================================

router.post('/spotify-create', function (req, res) {
  const isMix = !!req.query.isMix

  const name = req.body.name

  if (!name) {
    return res.render('alert', {
      style: 'alert',

      data: {
        message: 'Помилка',
        info: 'Введіть назву плейліста',
        link: isMix
          ? `/spotify-create?isMix=true`
          : '/spotify-create',
      },
    })
  }

  const playlist = Playlist.create(name)

  if (isMix) {
    Playlist.makeMix(playlist)
  }

  //............

  res.render('spotify-playlist', {
    style: 'spotify-playlist',

    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})

// ================================================================

router.get('/spotify-playlist', function (req, res) {
  const id = Number(req.query.id)

  const playlist = Playlist.getById(id)

  console.log('ID:', id, 'Playlist:', playlist)

  if (!playlist) {
    return res.render('alert', {
      style: 'alert',

      data: {
        message: 'Помилка',
        info: 'Такого плейліста не знайдено',
        link: '/spotify-choose',
      },
    })
  }

  res.render('spotify-playlist', {
    style: 'spotify-playlist',

    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})

// ================================================================

router.post('/spotify-playlist', function (req, res) {
  const playlistId = Number(req.query.playlistId)
  const playlist = Playlist.getById(playlistId)

  const add = Library.addPlaylist(playlistId)

  console.log('playlistId:', playlistId, 'add:', add)

  if (!playlist) {
    return res.render('alert', {
      style: 'alert',

      data: {
        message: 'Помилка',
        info: 'Такого плейліста не знайдено',
        link: '/spotify-choose',
      },
    })
  }

  res.render('spotify-library', {
    style: 'spotify-library',

    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})

// ================================================================

router.get('/spotify-track-delete', function (req, res) {
  const playlistId = Number(req.query.playlistId)
  const trackId = Number(req.query.trackId)

  const playlist = Playlist.getById(playlistId)

  console.log(
    'playlistId:',
    playlistId,
    'trackId:',
    trackId,
    'playlist:',
    playlist,
  )

  if (!playlist) {
    return res.render('alert', {
      style: 'alert',

      data: {
        message: 'Помилка',
        info: 'Такого плейліста не знайдено',
        link: `/spotify-playlist?id=${playlistId}`,
      },
    })
  }

  playlist.deleteTrackById(trackId)

  res.render('spotify-playlist', {
    style: 'spotify-playlist',

    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})

// ================================================================

router.get('/spotify-track-add', function (req, res) {
  const playlistId = Number(req.query.playlistId)
  const playlist = Playlist.getById(playlistId)
  const allTracks = Track.getList()

  console.log(
    'playlistId:',
    playlistId,
    'allTracks:',
    allTracks,
    'playlist:',
    playlist,
  )

  res.render('spotify-track-add', {
    style: 'spotify-track-add',

    data: {
      playlistId: playlist.id,
      tracks: allTracks,
    },
  })
})

// ================================================================

router.post('/spotify-track-add', function (req, res) {
  const playlistId = Number(req.body.playlistId)
  const trackId = Number(req.body.trackId)

  const playlist = Playlist.getById(playlistId)

  if (!playlist) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Такого плейліста не знайдено',
        link: `/spotify-playlist?id=${playlistId}`,
      },
    })
  }

  const trackToAdd = Track.getList().find(
    (track) => track.id === trackId,
  )

  if (!trackToAdd) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Такого треку не знайдено',
        link: `/spotify-track-add?playlistId=${playlistId}`,
      },
    })
  }

  playlist.tracks.push(trackToAdd)

  res.render('spotify-playlist', {
    style: 'spotify-playlist',
    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})

// ================================================================

router.get('/spotify-library', function (req, res) {
  const playlistId = Number(req.query.playlistId)
  const playlist = Playlist.getById(playlistId)

  console.log(
    'playlistId:',
    playlistId,
    'playlist:',
    playlist,
  )

  const add = Library.addPlaylist(playlistId)

  const playlists = Library.getList()

  // let playlistCount = 0

  // const imgs = {
  //   img1: '/img/firstPlaylist.png',
  //   img2: '/img/firstPlaylist.png',
  //   img3: '/img/firstPlaylist.png',
  //   img4: '/img/firstPlaylist.png',
  // }

  // const chooseImg = playlists.map((playlist) => {
  //   playlistCount++

  //   if (playlistCount === 1) {
  //     playlist.image = imgs.img1
  //   } else if (playlistCount === 2) {
  //     playlist.image = imgs.img2
  //   } else if (playlistCount === 3) {
  //     playlist.image = imgs.img3
  //   } else if (playlistCount === 4) {
  //     playlist.image = imgs.img4
  //   } else {
  //     playlist.image = 'https://picsum.photos/345/345'
  //   }
  //   return playlistCount
  // })

  console.log(
    'playlistId:',
    playlistId,
    'playlists:',
    playlists,
  )

  res.render('spotify-library', {
    style: 'spotify-library',

    data: {
      playlistId: playlist.id,
      tracksCount: playlist.tracks.length,
      name: playlist.name,
      list: Library.getList(),
      // image: chooseImg,
    },
  })
})

// ================================================================

router.get('/spotify-search', function (req, res) {
  const value = ''
  const list = Playlist.findListByValue(value)

  res.render('spotify-search', {
    style: 'spotify-search',

    data: {
      list: list.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),
      value,
    },
  })
})

// ================================================================

router.post('/spotify-search', function (req, res) {
  const value = req.body.value || ''
  const list = Playlist.findListByValue(value)

  console.log(value)

  res.render('spotify-search', {
    style: 'spotify-search',

    data: {
      list: list.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),
      value,
    },
  })
})

// ================================================================

// router.get('/spotify-library-delete', function (req, res) {
//   const playlistId = Number(req.query.playlistId)

//   const playlist = Playlist.getById(playlistId)

//   console.log('playlistId:', playlistId)

//   if (!playlist) {
//     return res.render('alert', {
//       style: 'alert',

//       data: {
//         message: 'Помилка',
//         info: 'Такого плейліста не знайдено',
//         link: `/spotify-playlist?id=${playlistId}`,
//       },
//     })
//   }

//   playlist.deletePlaylistById(playlistId)

//   const playlists = Library.getList()

//   res.render('spotify-library', {
//     style: 'spotify-library',

//     data: {
//       list: playlists,
//     },
//   })
// })

// ================================================================

// Підключаємо роутер до бек-енду
module.exports = router
