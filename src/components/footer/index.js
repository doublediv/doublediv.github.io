import tpl from './index.tpl'
import tpl2html from '@/utils/tpl2html'
export default {
    tpl(option){
        // return{}
        const {name} = option;
        return tpl2html(tpl, {
            name
        })
    }
}