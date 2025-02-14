import {matchHotKey} from "../util/hotKey";
import {fetchPost} from "../../util/fetch";
import {writeText} from "../util/compatibility";
import {openBacklink, openGraph, openOutline} from "../../editor/util";
import {focusByOffset, getSelectionOffset} from "../util/selection";
import {fullscreen} from "../breadcrumb/action";
import {addLoading, setPadding} from "../ui/initUI";
import {Constants} from "../../constants";
import {onGet} from "../util/onGet";

export const commonHotkey = (protyle: IProtyle, event: KeyboardEvent) => {
    const target = event.target as HTMLElement;
    if (matchHotKey(window.siyuan.config.keymap.editor.general.copyHPath.custom, event)) {
        fetchPost("/api/filetree/getHPathByID", {
            id: protyle.block.rootID
        }, (response) => {
            writeText(response.data);
        });
        event.preventDefault();
        event.stopPropagation();
        return true;
    }
    if (matchHotKey(window.siyuan.config.keymap.editor.general.refresh.custom, event)) {
        protyle.title.render(protyle, true);
        addLoading(protyle);
        fetchPost("/api/filetree/getDoc", {
            id: protyle.block.showAll ? protyle.block.id : protyle.block.rootID,
            mode: 0,
            size: protyle.block.showAll ? Constants.SIZE_GET_MAX : Constants.SIZE_GET,
        }, getResponse => {
            onGet(getResponse, protyle, protyle.block.showAll ? [Constants.CB_GET_ALL, Constants.CB_GET_FOCUS] : [Constants.CB_GET_FOCUS]);
        });
        event.preventDefault();
        event.stopPropagation();
        return true;
    }

    if (matchHotKey(window.siyuan.config.keymap.editor.general.fullscreen.custom, event)) {
        fullscreen(protyle.element);
        setPadding(protyle);
        event.preventDefault();
        event.stopPropagation();
        return true;
    }
    if (protyle.model) {
        if (matchHotKey(window.siyuan.config.keymap.editor.general.backlinks.custom, event)) {
            event.preventDefault();
            event.stopPropagation();
            openBacklink(protyle);
            return true;
        }
        if (matchHotKey(window.siyuan.config.keymap.editor.general.graphView.custom, event)) {
            event.preventDefault();
            event.stopPropagation();
            openGraph(protyle);
            return true;
        }
        if (matchHotKey(window.siyuan.config.keymap.editor.general.outline.custom, event)) {
            event.preventDefault();
            event.stopPropagation();
            const offset = getSelectionOffset(target);
            openOutline(protyle);
            // switchWnd 后，range会被清空，需要重新设置
            focusByOffset(target, offset.start, offset.end);
            return true;
        }
    }
};
