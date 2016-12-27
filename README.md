[nikhil.io](https://nikhil.io)
==============================

Personal page. See `package.json` for some commands.

Installation Issues
-------------------

`brew`/`pacman` install `cairo` for canvas to avoid `npm` errors. When installing `node-sass`, specify the version (3.4.2)

TODO
----

* [ ] Remove jQuery dependency; figure out how to fade background
* [X] Convert to ES6
* [X] Add ES6 linting
* [ ] Review JS code
* [X] You don't need _all_ the font weights, yo
* [X] Add SASS linting

Notes
-----

### ES6, Linting, and Dependency Pains

To use Babel and ESLint,

    npm install babel-core \
                babel-loader \
                babel-preset-es2015 \
                eslint \
                eslint-loader \
                --dev

That's the base. I didn't want to author all ESLint rules by hand ([or not](http://rapilabs.github.io/eslintrc-generator)) and really like the [AirBnB Guidelines](https://github.com/airbnb/javascript) so

    npm install eslint-config-airbnb \
                eslint-plugin-import \
                eslint-plugin-react \
                eslint-plugin-jsx-a11y \
                --dev

That last dependency proved to be a pain: [1](https://github.com/verekia/js-stack-from-scratch/issues/81), [2](https://github.com/evcohen/eslint-plugin-jsx-a11y/issues/116), [3](https://github.com/eslint/eslint/issues/7338), [4](https://github.com/eslint/eslint/issues/6843) and many more. Oh the _joy_ of Javascript! [This](https://github.com/verekia/js-stack-from-scratch/issues/81#issuecomment-259158481) was the fix BTW.
