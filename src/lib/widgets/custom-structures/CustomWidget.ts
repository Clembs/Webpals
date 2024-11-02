import {
	array,
	boolean,
	lazy,
	literal,
	number,
	picklist,
	strictObject,
	string,
	union,
	type GenericSchema
} from 'valibot';
import type { AnyBlock } from '../types';

export const BlockStructure: GenericSchema<AnyBlock> = union([
	strictObject({
		type: literal('text'),
		content: string(),
		editable: boolean(),
		text_type: picklist(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'paragraph', 'subtext'])
	}),
	strictObject({
		type: literal('layout'),
		blocks: array(lazy(() => BlockStructure))
	}),
	strictObject({
		type: literal('key_value'),
		key: string(),
		value: string()
	})
]);

export const CustomWidgetStructure = strictObject({
	id: string(),
	position: number(),
	blocks: array(BlockStructure)
});
