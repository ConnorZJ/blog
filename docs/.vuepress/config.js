module.exports = {
  "title": "CCCCCConnor",
  "description": "Nothing Is True, Everything is Permitted",
  "base": '/blog/',
  "head": [
    [
      "link",
      {
        "rel": "icon",
        "href": "/bear.ico"
      }
    ],
    [
      "meta",
      {
        "name": "viewport",
        "content": "width=device-width,initial-scale=1,user-scalable=no"
      }
    ]
  ],
  "theme": "reco",
  "themeConfig": {
    "nav": [
      {
        "text": "Home",
        "link": "/",
        "icon": "reco-home"
      },
      {
        "text": "TimeLine",
        "link": "/timeline/",
        "icon": "reco-date"
      },
      {
        "text": "Contact",
        "icon": "reco-message",
        "items": [
          {
            "text": "GitHub",
            "link": "https://github.com/ConnorZJ",
            "icon": "reco-github"
          },
        ]
      }
    ],
    "type": "blog",
    "blogConfig": {
      "category": {
        "location": 2,
        "text": "Category"
      },
      "tag": {
        "location": 3,
        "text": "Tag"
      }
    },
    "search": true,
    "searchMaxSuggestions": 10,
    "sidebar": "auto",
    "lastUpdated": "Last Updated",
    "author": "Xiong ZiJie",
    "authorAvatar": "/avatar.png",
    "startYear": "2019",
    themePicker: {
      colorName1: 'red',
      colorName2: 'yellow',
      colorName3: 'blue'
    }
  },
  "markdown": {
    "lineNumbers": true
  },
  plugins: ['cursor-effects','@vuepress-reco/vuepress-plugin-kan-ban-niang']
}