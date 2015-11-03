var grunt = require('grunt');
var nconf = require('nconf');
var path = require('path');

nconf.use('file', {
  file: path.join(__dirname, 'build-env.json')
});

var electron_cfg = nconf.get('electron');
var electron_disturl = electron_cfg.disturl;
var electron_version = electron_cfg.version;

var app_name = nconf.get('app:name');
var app_description = nconf.get('app:description');
var app_version = nconf.get('app:version');
var app_icons = nconf.get('app:icons');

require('load-grunt-tasks')(grunt);

grunt.initConfig({

  clean: {
    build: ['build']
  },

  copy: {
    osxBuild: {
      expand: true,
      cwd: 'app',
      src: ['**', '!node_modules/**/*'],
      dest: 'build/osx/'
    },
    win32Build: {
      expand: true,
      cwd: 'app',
      src: ['**', '!node_modules/**/*'],
      dest: 'build/win32/'
    },
    win64Build: {
      expand: true,
      cwd: 'app',
      src: ['**', '!node_modules/**/*'],
      dest: 'build/win64/'
    },
    linux32Build: {
      expand: true,
      cwd: 'app',
      src: ['**', '!node_modules/**/*'],
      dest: 'build/linux32/'
    },
    linux64Build: {
      expand: true,
      cwd: 'app',
      src: ['**', '!node_modules/**/*'],
      dest: 'build/linux64/'
    }
  },

  'npm-install': {
    osxBuild: {
      options: {
        cwd: 'build/osx',
        disturl: electron_disturl,
        distver: electron_version,
        target: 'darwin',
        arch: 'x64',
        runtime: 'electron'
      }
    },
    win32Build: {
      options: {
        cwd: 'build/win32',
        disturl: electron_disturl,
        distver: electron_version,
        target: 'win32',
        arch: 'ia32',
        runtime: 'electron'
      }
    },
    win64Build: {
      options: {
        cwd: 'build/win64',
        disturl: electron_disturl,
        distver: electron_version,
        target: 'win32',
        arch: 'x64',
        runtime: 'electron'
      }
    },
    linux32Build: {
      options: {
        cwd: 'build/linux32',
        disturl: electron_disturl,
        distver: electron_version,
        target: 'linux',
        arch: 'ia32',
        runtime: 'electron'
      }
    },
    linux64Build: {
      options: {
        cwd: 'build/linux64',
        disturl: electron_disturl,
        distver: electron_version,
        target: 'linux',
        arch: 'x64',
        runtime: 'electron'
      }
    }
  },

  electron: {
    osxBuild: {
      options: {
        name: app_name,
        dir: 'build/osx',
        out: 'build',
        version: electron_version,
        platform: 'darwin',
        arch: 'x64',
        icon: app_icons.icns,
        prune: true,
        asar: true
      }
    },
    win32Build: {
      options: {
        name: app_name,
        dir: 'build/win32',
        out: 'build',
        version: electron_version,
        platform: 'win32',
        arch: 'ia32',
        icon: app_icons.ico,
        prune: true,
        asar: true
      }
    },
    win64Build: {
      options: {
        name: app_name,
        dir: 'build/win64',
        out: 'build',
        version: electron_version,
        platform: 'win32',
        arch: 'x64',
        icon: app_icons.ico,
        prune: true,
        asar: true
      }
    },
    linux32Build: {
      options: {
        name: app_name,
        dir: 'build/linux32',
        out: 'build',
        version: electron_version,
        platform: 'linux',
        arch: 'ia32',
        icon: app_icons.png,
        prune: true,
        asar: true
      }
    },
    linux64Build: {
      options: {
        name: app_name,
        dir: 'build/linux64',
        out: 'build',
        version: electron_version,
        platform: 'linux',
        arch: 'x64',
        icon: app_icons.png,
        prune: true,
        asar: true
      }
    }
  },

  appdmg: {
    options: {
      basepath: '.',
      title: app_name,
      icon: app_icons.icns,
      background: 'app/assets/background.png',
      'icon-size': 80,
      contents: [{
        x: 300,
        y: 250,
        type: 'link',
        path: '/Applications'
      }, {
        x: 120,
        y: 130,
        type: 'file',
        path: 'build/' + app_name + '-darwin-x64/' + app_name + '.app/'
      }]
    },
    target: {
      dest: 'build/pkg/' + app_name + '.dmg'
    }
  },

  'electron-redhat-installer': {
    options: {
      productName: app_name,
      productDescription: app_description,
      productVersion: app_version,
      bin: app_name,
      icon: app_icons.png,
      categories: [
        'Utility'
      ],
      rename: function(dest, src) {
        return dest + '<%= name %>-<%= version %>-<%= revision %>.<%= arch %>.rpm';
      }
    },
    linux32: {
      options: {
        arch: 'x86'
      },
      src: 'build/' + app_name + '-linux-ia32/',
      dest: 'build/pkg/'
    },
    linux64: {
      options: {
        arch: 'x86_64'
      },
      src: 'build/' + app_name + '-linux-x64/',
      dest: 'build/pkg/'
    }
  },

  'electron-debian-installer': {
    options: {
      productName: app_name,
      productDescription: app_description,
      productVersion: app_version,
      bin: app_name,
      icon: app_icons.png,
      section: 'devel',
      priority: 'optional',
      lintianOverrides: [
        'changelog-file-missing-in-native-package',
        'executable-not-elf-or-script',
        'extra-license-file'
      ],
      categories: [
        'Utility'
      ],
      rename: function(dest, src) {
        return dest + '<%= name %>_<%= version %>-<%= revision %>.<%= arch %>.deb';
      }
    },
    linux32: {
      options: {
        arch: 'x86'
      },
      src: 'build/' + app_name + '-linux-ia32/',
      dest: 'build/pkg/'
    },
    linux64: {
      options: {
        arch: 'amd64'
      },
      src: 'build/' + app_name + '-linux-x64/',
      dest: 'build/pkg/'
    }
  },

  'electron-windows-installer': {
    options: {
      productName: app_name,
      productDescription: app_description,
      productVersion: app_version,
      icon: app_icons.ico,
      rename: function(dest, src) {
        if (/\.exe$/.test(src)) {
          src = '<%= name %>-<%= version %>-setup.exe';
        }
        return dest + src;
      }
    },
    win32: {
      src: 'build/' + app_name + '-win32-ia32/',
      dest: 'build/pkg/x86/'
    },
    win64: {
      src: 'build/' + app_name + '-win32-x64/',
      dest: 'build/pkg/x64/'
    }
  }

});

grunt.registerTask('osx', ['clean:build', 'copy:osxBuild', 'npm-install:osxBuild', 'electron:osxBuild', 'appdmg']);
grunt.registerTask('win', ['clean:build', 'copy:win32Build', 'copy:win64Build',
                           'npm-install:win32Build', 'npm-install:win64Build',  'electron:win32Build', 'electron:win64Build',
                           'electron-windows-installer:win32', 'electron-windows-installer:win64']);
grunt.registerTask('linux', ['clean:build', 'copy:linux32Build', 'copy:linux32Build', 'copy:linux64Build',
                           'npm-install:linux32Build', 'npm-install:linux64Build', 'electron:linux32Build', 'electron:linux64Build',
                           'electron-redhat-installer:linux32', 'electron-debian-installer:linux32',
                           'electron-redhat-installer:linux64', 'electron-debian-installer:linux64']);
