import { Block, PlainTextElement } from "@slack/types";
import { globalActions, blockActions } from "../config/actions";
import { modalCallbacks } from "../config/views";
import { section, divider, actionButton, actions, context, input } from '../utils/block-builder'

interface MessagePayload {
    text: string,
    blocks: Block[]
}

interface ViewsPayload {
    type: "modal",
    callback_id: string,
    title: PlainTextElement,
    blocks: Block[],
    submit?: PlainTextElement
}

export function emptyQueryView(): MessagePayload {
    return {
        text: `Please provide a search term, for example - \`/${globalActions.define} OKR\``,
        blocks: [
            section(':warning: You didn\'t specify a term to search for'),
            divider(),
            section(`You can use \`/${globalActions.define}\` to search for the definition of terms used by your company. What would you like to do?`),
            actions([
                actionButton('Add a term', blockActions.add_a_term),
                actionButton('Search for a term', blockActions.search_for_term)
            ],
                blockActions.search_or_add)
        ]
    }
}

export function definitionResultView(term: string, definition: string, author_id: string, last_update_ts: number): MessagePayload {
    return {
        text: `${term}`,
        blocks: [
          section(`${term}\n${definition}`),
          context(`Last updated by <@${author_id}> on <!date^${last_update_ts}^{date_pretty}|${last_update_ts}>`)
        ]
      }
}

export function addTermModalView(): ViewsPayload {
    return {
        type: "modal",
        submit: {
            type: 'plain_text',
            text: 'Submit',
            emoji: true
        },
        callback_id: modalCallbacks.create_modal,
        title: {
            text: "Add a new term",
            type: "plain_text"
        },
        blocks: [
            input('Term', 'new-term', 'The term you want to define'),
            input('Definition', 'new-definition', 'The definition of the term', true)
        ]
    }
}