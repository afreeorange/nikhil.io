$(window).load ->

    background_image = new Image()
    background_image.crossOrigin = 'anonymous'

    userFeed = new Instafeed(

        get: 'tagged',
        userId: '964162',
        accessToken: '964162.cf1e7d8.777feff80324427c8dcda940423b2c44',
        tagName: 'iowa',
        mock: true, # Doesn't automatically populate DOM
        limit: 50,

        error: (message) ->
            console.log '!!! ' + message
            $('#instagram span').show()

        success: (response) ->
            random_instagram_image = response.data[Math.floor(Math.random() * response.data.length)]
            random_background_uri = random_instagram_image.images.standard_resolution.url
            background_image.src = random_background_uri

            $('#instagram a').show().attr 'href', random_instagram_image.link
            $('#instagram a small').text random_instagram_image.location.name
                                    
            background_image.onload = ->
                colorThief = new ColorThief()
                dominant_color = colorThief.getColor(background_image)
                colors =
                    'r': dominant_color[0],
                    'g': dominant_color[1],
                    'b': dominant_color[2]

                $('h1').css 'color', tinycolor(colors).lighten(50).saturate(100)
                $('nav ul li a').css 'color', tinycolor(colors).saturate(50).lighten(35)

             $('#background').backstretch random_background_uri, {'fade': 'slow'};

        )

    userFeed.run()
