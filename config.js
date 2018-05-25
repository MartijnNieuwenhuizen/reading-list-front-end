import pkg from './package.json';
import dotenv from 'dotenv';

dotenv.load({ silent: true });

const base = {
    src: './src',
    dist: './dist',
    docs: './tasks/docs'
};

module.exports = {
    base: {
        src: base.src,
        dist: base.dist,
        docs: base.docs
    },

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
        src: {
            static: `${base.src}/static/scss/**/!(_)*.scss`,
            staticAll: `${base.src}/static/scss/**/*.scss`,
            components: `${base.src}/components/**/*.scss`,
            vendor: `${base.src}/static/scss/vendor/**/*.scss`
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
            statics: `${base.docs}/static/**`,
            component: 'component-detail.njk',
            preview: 'component-preview.njk',
            components: `${base.src}/components`,
            atom: `${base.src}/components/00_atom`,
            molecule: `${base.src}/components/01_molecule`,
            organism: `${base.src}/components/02_organism`,
            componentsAll: `${base.src}/components/**/*.yml`,
            componentsData: `${base.src}/components/**/*.json`
        },
        dist: {
            base: base.dist,
            index: `${base.dist}/index.html`,
            static: `${base.dist}/docs/static/`,
            components: `${base.dist}/docs/components/`,
            atom: '/docs/components/00_atom/',
            molecule: '/docs/components/01_molecule/',
            organism: '/docs/components/02_organism/'
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
            templates: `${base.src}/templates/**/*.njk`,
            templatesDir: `${base.src}/templates`,
            templatesData: `${base.src}/templates/**/*.json`,
            layout: `${base.src}/layout/*.njk`,
            layoutDir: `${base.src}/layout`,
            components: `${base.src}/components/**/*.njk`,
            componentsDir: `${base.src}/components`,
            componentsData: `${base.src}/components/**/*.json`,
            component: `${base.src}/components`,
            componentCopy: `${base.src}/components/**/*.njk`,
            atom: '00_atom',
            molecule: '01_molecule',
            organism: '02_organism'
        },
        dist: {
            base: `${base.dist}/templates`,
            componentsDist: `${base.dist}/components`
        },
        baseUri: '/'
    },

    img: {
        src: {
            all: `${base.src}/static/img/**/*.{svg,png,jpg,gif,webp}`
        },
        dist: {
            base: `${base.dist}/static/img`
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
    },

    getData: {
        dest: 'src/components/02_organism/article-list/article-list.json',
        url: 'http://localhost:8080/'
    }

};
