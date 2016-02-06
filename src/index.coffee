rgbaFromColor = (tinyColorObject) ->
    'rgba(' + 
        Math.round(tinyColorObject._r) + ',' + 
        Math.round(tinyColorObject._g) + ',' + 
        Math.round(tinyColorObject._b) + ', 1)'

$(window).load ->

    background_image = new Image()
    background_image.crossOrigin = 'anonymous'
    colorThief = new ColorThief()
    timeoutDuration = 4500

    userFeed = new Instafeed(

        get: 'user',
        userId: '964162',
        accessToken: '964162.cf1e7d8.777feff80324427c8dcda940423b2c44',
        mock: true, # Don't automatically populate DOM

        error: (message) ->
            console.log '!!! ' + message
            $('#instagram span').show()

        success: (response) ->

            i = 0

            cycleImages = ->
                instagram_image = response.data[i]
                background_image.src = instagram_image.images.standard_resolution.url

                $('#instagram a').show().attr 'href', instagram_image.link
                $('#instagram a small').text instagram_image.location.name if instagram_image.location

                background_image.onload = ->
                    dominant_color = colorThief.getColor(background_image)
                    colors =
                        'r': dominant_color[0],
                        'g': dominant_color[1],
                        'b': dominant_color[2]

                    mainColor = tinycolor(colors).lighten(50).saturate(100)
                    secondaryColor = tinycolor(colors).saturate(50).lighten(35)

                    $('h1').css
                        'color': mainColor
                        WebkitTransition : 'color 1s'
                        MozTransition    : 'color 1s'
                        MsTransition     : 'color 1s'
                        OTransition      : 'color 1s'
                        transition       : 'color 1s'
                    $('nav ul li a').css
                        'color': secondaryColor
                        WebkitTransition : 'color 1s'
                        MozTransition    : 'color 1s'
                        MsTransition     : 'color 1s'
                        OTransition      : 'color 1s'
                        transition       : 'color 1s'

                    $('#countdown').circleProgress
                        value: 1
                        size: 25
                        thickness: 5
                        lineCap: 'round'
                        animation:
                            duration: timeoutDuration
                        fill:
                            color: rgbaFromColor(mainColor)

                $('#background').backstretch instagram_image.images.standard_resolution.url, {'fade': 'slow'};

                i++
                i = 0 if i >= response.data.length - 1

                setTimeout cycleImages, timeoutDuration

            cycleImages()

        )

    userFeed.run()
