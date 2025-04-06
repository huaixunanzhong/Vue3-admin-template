import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import path from 'path'
import { viteMockServe } from 'vite-plugin-mock'
import Setting from './src/setting.env'

const env = process.env.NODE_ENV

const getAliasSetting = () => {
    const alias = [
        { find: '@/api', replacement: path.resolve(__dirname, 'src/api') },
        { find: '@/', replacement: `${path.resolve(__dirname, 'src')}/` },
        { find: /^~/, replacement: '' }
    ]
    return alias
}
// https://vitejs.dev/config/
export default defineConfig({
    build: {
        target: 'es2015',
        outDir: path.resolve(__dirname, 'dist'),
        assetsDir: 'assets',
        assetsInlineLimit: 8192,
        sourcemap: false,
        emptyOutDir: true,
        rollupOptions: {
            input: path.resolve(__dirname, 'index.html'),
            output: {
                chunkFileNames: 'js/[name].[hash].js',
                entryFileNames: 'js/[name].[hash].js'
                // assetFileNames: "assets/[name].[hash].[ext]",
            }
        }
    },
    css: {
        preprocessorOptions: {
            less: {
                javascriptEnabled: true
            }
        }
    },
    plugins: [
        vue(),
        vueJsx(),
        viteMockServe({
            mockPath: 'mock', // 目录位置
            logger: true, //  是否在控制台显示请求日志
            supportTs: true, // 是否读取ts文件模块
            localEnabled: true, // 设置是否启用本地mock文件
            prodEnabled: true, // 设置打包是否启用mock功能
            // 这样可以控制关闭mock的时候不让mock打包到最终代码内
            injectCode: `
                import { setupProdMockServer } from '../mock/index';
                setupProdMockServer();
            `
        })
    ],
    resolve: {
        alias: getAliasSetting(),
        extensions: ['.ts', '.tsx', '.js', '.mjs', '.vue', '.json', '.less', '.css']
    }
})
