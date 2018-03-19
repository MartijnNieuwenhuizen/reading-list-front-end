import pkg from './package.json';
import dotenv from 'dotenv';

dotenv.load({ silent: true });

const base = {
    src: `${__dirname}/src`,
    dist: `${__dirname}/dist`,
    docs: `${__dirname}/tasks/docs`
};

module.exports = {

    browsersync: {
        server: {
            baseDir: base.dist
        },
        open: false,
        ui: false,
        notify: false
    },

    clean: {
        dist: {
            base: base.dist
        }
    },

    css: {
        autoprefixer: {
            browsers: [
                'last 2 versions',
                '> 1% in NL',
                'IE >= 9',
                'iOS >= 6',
                'Safari >= 6',
                'Firefox ESR'
            ]
        },
        src: {
            static: `${base.src}/static/css/**/!(_)*.scss`,
            main: `${base.src}/static/css/all.scss`,
            staticAll: `${base.src}/static/css/**/*.scss`,
            components: `${base.src}/components/**/*.scss`,
            vendor: `${base.src}/static/css/vendor/**/*.scss`,
            sprite: `${base.src}/static/css/_sprite.scss`
        },
        dist: {
            base: `${base.dist}/static/css`
        }
    },

    docs: {
        src: {
            index: `${base.docs}/index.njk`,
            indexDir: base.docs,
            layoutDir: `${base.docs}/layout`,
            templates: `${base.src}/templates`,
            templatesAll: `${base.src}/templates/**/!(_)**.njk`,
            statics: `${base.docs}/static/**`,
            component: `${base.docs}/component-detail.njk`,
            demo: `${base.docs}/component-demo.njk`,
            components: `${base.src}/components`,
            componentsAll: `${base.src}/components/**/!(_)*.yml`
        },
        dist: {
            base: base.dist,
            index: `${base.dist}/index.html`,
            static: `${base.dist}/docs/static/`,
            components: `${base.dist}/docs/components/`
        },
        dataFileNames: {
            content: '-content.nl.json',
            data: '-data.json'
        }
    },

    fonts: {
        src: {
            fonts: `${base.src}/static/fonts/**/*`
        },
        dist: {
            fonts: `${base.dist}/static/fonts`
        }
    },

    githooks: {
        src: {
            all: './tasks/githooks/*'
        },
        dist: {
            base: './.git/hooks',
            all: './.git/hooks/*'
        }
    },

    html: {
        src: {
            templates: `${base.src}/templates/**/!(_)*.njk`,
            templatesDir: `${base.src}/templates`,
            layout: `${base.src}/layout/*.njk`,
            layoutDir: `${base.src}/layout`,
            components: `${base.src}/components/**/*.njk`,
            componentsDir: `${base.src}/components`,
            componentsJSON: `${base.src}/(templates|components)/**/*.json`
        },
        dist: {
            base: `${base.dist}/templates`
        },
        baseUri: {
            demo: '../../../',
            templates: '/'
        }
    },

    img: {
        src: {
            all: `${base.src}/static/img/{!(puv-logos),}/*.{svg,png,jpg,gif,webp}`,
            imgSprite: `${base.src}/static/img/sprite/**/*.svg`,
            puvLogos: `${base.src}/static/img/puv-logos/*.png`
        },
        dist: {
            base: `${base.dist}/static/img`,
            spriteBase: `${base.src}/static`,
            puvLogosBase: `${base.dist}/static/img/puv-logos`
        },
        svgSpriteConfig: {
            mode: {
                css: {
                    sprite: '../img/sprite.svg',
                    bust: false,
                    render: {
                        scss: {
                            dest: '_sprite.scss'
                        }
                    }
                }
            }
        },
        sharpOps: (sharp, contents) => {

            const [width, height] = [400, 100];
            const transparent = { r: 0, g: 0, b: 0, alpha: 0 };
            const bgConfig = {
                width: width,
                height: height,
                channels: 4,
                background: transparent
            };

            const createBackground = imgBuffer => {
                return sharp({ create: bgConfig})
                    .overlayWith(imgBuffer, { gravity: sharp.gravity.northwest })
                    .png()
                    .toBuffer();
            };

            return sharp(contents)
                .resize(width, height)
                .max()
                .toBuffer()
                .then(createBackground);
        }
    },

    js: {
        src: {
            all: `${base.src}/static/js/**/*.js`,
            bundles: `${base.src}/static/js/*.js`,
            components: `${base.src}/components/**/!(*.Spec).js`,
            vendor: `${base.src}/static/js/vendor`,
            tests: `${base.src}/components/**/*.Spec.js`
        },
        dist: {
            base: `${base.dist}/static/js`,
            babelHelpers: `${base.dist}/static/js/babel-helpers.js`
        },
        browserify: {
            paths: [`${base.src}/static/js/`, `${base.src}/components/`],
            debug: true,
            // Keep in config, we concat 'watchify' when running 'gulp dev'
            plugin: ['errorify'],
            transform: ['babelify', 'require-globify']
        },
        eslintAutofix: false
    },

    nunjucksOptions: {
        throwOnUndefined: false
    },

    upload: {
        src: {
            all: `${base.dist}/**`
        },
        dist: {
            target: '/test',
            base: base.dist
        },
        options: {
            // Defined in .env file
            host: process.env.UPLOAD_HOST,
            user: process.env.UPLOAD_USER,
            password: process.env.UPLOAD_PASSWORD
        }
    },

    zip: {
        filename: `${pkg.name}.zip`,
        src: {
            all: `${base.dist}/**/!(*.zip)`
        },
        dist: {
            base: base.dist
        }
    }

};
