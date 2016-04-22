rgbaFromColor = (tinyColorObject, opacity) ->
    'rgba(' + Math.round(tinyColorObject._r) + ',' + 
              Math.round(tinyColorObject._g) + ',' + 
              Math.round(tinyColorObject._b) + ',' + opacity + ')'

$(window).load ->

    background_image = new Image()
    background_image.crossOrigin = 'anonymous'
    colorThief = new ColorThief()
    timeoutDuration = 4000
    reverseSpin = false

    userFeed = new Instafeed(

        get: 'user',
        userId: '964162',
        accessToken: '964162.cf1e7d8.777feff80324427c8dcda940423b2c44',
        mock: true, # Don't automatically populate DOM

        error: (message) ->
            console.log '!!! ' + message
            $('#countdown').hide()
            $('.real-o').show()
            $('#instagram span').show()

        success: (response) ->

            i = 0

            cycleImages = ->
                instagram_image = response.data[i]
                background_image.src = instagram_image.images.standard_resolution.url

                $('#instagram a').show().attr 'href', instagram_image.link
                $('#instagram a').text instagram_image.location.name if instagram_image.location

                background_image.onload = ->
                    dominant_color = colorThief.getColor(background_image)
                    colors =
                        'r': dominant_color[0],
                        'g': dominant_color[1],
                        'b': dominant_color[2]

                    headingColor = tinycolor(colors).complement().saturate(100).brighten(50)
                    paragraphColor = tinycolor(colors).complement().lighten(100)
                    linkColor = tinycolor(colors).saturate(100).brighten(50)
                    borderColor = rgbaFromColor(linkColor, 0.25)

                    if !reverseSpin
                        circleColor = rgbaFromColor(headingColor, 1)
                        trackColor = rgbaFromColor(paragraphColor, 0.2)
                    else
                        trackColor = rgbaFromColor(headingColor, 1)
                        circleColor = rgbaFromColor(paragraphColor, 0.2)

                    $('h1').css
                        'color': headingColor

                    $('p').css
                        'color': paragraphColor

                    $('#countdown').circleProgress
                        value: 1.0
                        size: 32
                        thickness: 9
                        lineCap: 'square'
                        animation:
                            duration: timeoutDuration
                        fill:
                            color: circleColor
                        emptyFill: trackColor

                    $('#container a').css
                        'color': linkColor
                        'border-bottom': '3px solid ' + borderColor

                    $('#container a').mouseenter(-> 
                        $(this).css
                            'border-bottom': '3px solid ' + linkColor
                            # 'background': rgbaFromColor(tinycolor(paragraphColor), 0.15)
                    ).mouseleave ->
                        $(this).css
                            'border-bottom': '3px solid ' + borderColor
                            'background': 'transparent'

                $('#background').backstretch instagram_image.images.standard_resolution.url, {'fade': 'slow'}

                i++
                i = 0 if i >= response.data.length - 1

                reverseSpin = !reverseSpin

                setTimeout cycleImages, timeoutDuration

            cycleImages()

        )

    userFeed.run()
