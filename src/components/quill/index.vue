<template>
    <div class="i-quill" :class="classes">
        <div ref="editor" :style="styles"></div>
    </div>
</template>
 
<script>
    import Quill from 'quill';
    export default {
        name: 'i-quill',
        props: {
            value: {
                type: String,
                default: ''
            },
            border: {
                type: Boolean,
                default: false
            },
            height: {
                type: Number
            },
            minHeight: {
                type: Number
            }
        },
        data () {
            return {
                Quill: null,
                currentValue: '',
                options: {
                    theme: 'snow',
                    bounds: document.body,
                    debug: 'warn',
                    modules: {
                        toolbar: [
                            ['bold', 'italic', 'underline', 'strike'],
                            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                            [{ 'size': ['small', false, 'large', 'huge'] }],
                            [{ 'color': [] }, { 'background': [] }],
                            ['blockquote', 'code-block'],
                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                            // [{ 'script': 'sub' }, { 'script': 'super' }],
                            [{ 'indent': '-1' }, { 'indent': '+1' }],
                            [{ 'align': [] }],
                            [{ 'direction': 'rtl' }],
                            // [{ 'font': [] }],
                            ['clean'],
                            ['link', 'image']
                        ]
                    },
                    placeholder: '内容...',
                    readOnly: false
                }
            }
        },
        computed: {
            classes () {
                return [
                    {
                        'i-quill-no-border': !this.border
                    }
                ];
            },
            styles () {
                let style = {};
                if (this.minHeight) {
                    style.minHeight = `${this.minHeight}px`;
                }
                if (this.height) {
                    style.height = `${this.height}px`;
                }
                return style;
            }
        },
        watch: {
            value: {
                handler (val) {
                    if (val !== this.currentValue) {
                        this.currentValue = val;
                        if (this.Quill) {
                            this.Quill.pasteHTML(this.value);
                        }
                    }
                },
                immediate: true
            }
        },
        methods: {
            init () {
                const editor = this.$refs.editor;
                // 初始化编辑器
                this.Quill = new Quill(editor, this.options);
                this.Quill.insertText(0, 'hello world')
            }
        },
        mounted () {
            this.init();
        },
        beforeDestroy () {
            // 在组件销毁后销毁实例
            this.Quill = null;
        }
    }
</script>
<style>
    @import '~quill/dist/quill.core.css';
    @import '~quill/dist/quill.snow.css';
    @import '~quill/dist/quill.bubble.css';
</style>
<style lang="less">
    .i-quill-no-border{
        .ql-toolbar.ql-snow{
            border: none;
            border-bottom: 1px solid #e8eaec;
        }
        .ql-container.ql-snow{
            border: none;
        }
    }
</style>