export default function detect(body) {
    // TODO: fix hardcoded value
    if (body.startsWith("(this.webpackChunkdiscord_app=this.webpackChunkdiscord_app||[])")) {
        return true;
    }

    // TODO: fix hardcoded value
    if (body.startsWith('"use strict";(this.webpackChunkdiscord_app=this.webpackChunkdiscord_app||[])')) {
        return true;
    }

    // TODO: fix hardcoded value
    if (body.includes("(this.webpackChunkdiscord_app=this.webpackChunkdiscord_app||[])")) {
        return true;
    }

    /////

    return false;
}
