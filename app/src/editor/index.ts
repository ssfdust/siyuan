import {Tab} from "../layout/Tab";
import Protyle from "../protyle";
import {Model} from "../layout/Model";
import {disabledProtyle} from "../protyle/util/onGet";
import {setPadding} from "../protyle/ui/initUI";
import {getAllModels} from "../layout/getAll";

export class Editor extends Model {
    public element: HTMLElement;
    public editor: Protyle;
    public headElement: HTMLElement;

    constructor(options: {
        tab: Tab,
        blockId: string,
        mode?: TEditorMode,
        hasContext?: boolean
        action?: string[]
    }) {
        super({
            id: options.tab.id,
        });
        if (window.siyuan.config.fileTree.openFilesUseCurrentTab) {
            options.tab.headElement.classList.add("item--unupdate");
        }
        this.headElement = options.tab.headElement;
        this.element = options.tab.panelElement;
        this.initProtyle(options);
    }

    private initProtyle(options:  {
        blockId: string,
        hasContext?: boolean
        action?: string[]
        mode?: TEditorMode,
    }) {
        this.editor = new Protyle(this.element, {
            action: options.action,
            blockId: options.blockId,
            mode: options.mode,
            hasContext: options.hasContext,
            render: {
                title: true,
                background: true,
                scroll: true,
            },
            typewriterMode: true,
            after: (editor) => {
                editor.protyle.model = this;
                if (window.siyuan.config.readonly) {
                    disabledProtyle(editor.protyle);
                }

                if (window.siyuan.editorIsFullscreen) {
                    editor.protyle.element.classList.add("fullscreen");
                    setPadding(editor.protyle);
                    getAllModels().editor.forEach(item => {
                        if (!editor.protyle.element.isSameNode(item.element) && item.element.classList.contains("fullscreen")) {
                            item.element.classList.remove("fullscreen");
                            setPadding(item.editor.protyle);
                        }
                    });
                }
            },
        });
    }
}
