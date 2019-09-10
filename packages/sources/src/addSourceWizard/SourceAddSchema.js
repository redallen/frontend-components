import React from 'react';
import { componentTypes, validatorTypes } from '@data-driven-forms/react-form-renderer';
import { Popover, TextContent, TextList, TextListItem, Text, TextVariants, Title } from '@patternfly/react-core';
import { QuestionCircleIcon } from '@patternfly/react-icons';
import SSLFormLabel from './SSLFormLabel';
import { AwsIcon, OpenshiftIcon } from '@patternfly/react-icons';

const compileAllSourcesComboOptions = (sourceTypes) => (
    [
        ...sourceTypes.map(t => ({
            value: t.name,
            label: t.product_name
        }))
    ]
);

const compileAllApplicationComboOptions = (applicationTypes) => (
    [
        ...applicationTypes.map(t => ({
            value: t.id,
            label: t.display_name
        }))
    ]
);

/* return hash of form: { amazon: 'amazon', google: 'google', openshift: 'openshift' } */
const compileStepMapper = (sourceTypes) => sourceTypes.reduce((acc, curr) => ({ ...acc, [curr.name]: curr.name }), {});

const iconMapper = (name, DefaultIcon) => ({
    openshift: OpenshiftIcon,
    amazon: AwsIcon
}[name] || DefaultIcon);

const firstStepNew = (sourceTypes) => ({
    title: 'Select a source type',
    name: 'step_1',
    stepKey: 1,
    nextStep: {
        when: 'source_type',
        stepMapper: compileStepMapper(sourceTypes)
    },
    fields: [
        {
            component: 'description',
            name: 'description-summary',
            content: <TextContent key='step1'>
                <Text component={ TextVariants.p }>
                To import data for an application, you need to connect to a data source.
                To begin, input a name and select the type of source you want to collect data from.
                </Text>
                <Text component={ TextVariants.p }>
            All fields are required.
                </Text>
            </TextContent>
        },
        {
            component: componentTypes.TEXT_FIELD,
            name: 'source.name',
            type: 'text',
            label: 'Name',
            helperText: 'For example, Source_1',
            isRequired: true,
            validate: [{
                type: validatorTypes.REQUIRED
            }]
        }, {
            component: 'card-select',
            name: 'source_type',
            isRequired: true,
            label: 'Type',
            iconMapper,
            validate: [{
                type: validatorTypes.REQUIRED
            }],
            options: compileAllSourcesComboOptions(sourceTypes)
        }]
});

export const temporaryHardcodedSourceSchemas = {
    openshift: [
        {
            title: 'Add source credentials',
            fields: [{
                component: 'description',
                name: 'description-summary',
                content: <TextContent key='1'>
                    <Text component={ TextVariants.p }>
                    Add credentials that enable communication with this source.
                        This source requires the login token.
                    </Text>
                    <Text component={ TextVariants.p }>
                    To collect data from a Red Hat OpenShift Container Platform source,
                    </Text>
                    <TextContent>
                        <TextList component='ul'>
                            <TextListItem component='li' key='1'>
                            Log in to the Red Hat OpenShift Container Platform cluster with an account
                                that has access to the namespace
                            </TextListItem>
                            <TextListItem component='li' key='2'>
                            Run the following command to obtain your login token:
                                <b>&nbsp;# oc sa get-token -n management-infra management-admin</b>
                            </TextListItem>
                            <TextListItem component='li' key='3'>
                            Copy the token and paste it in the following field.
                            </TextListItem>
                        </TextList>
                    </TextContent>
                </TextContent>
            }, {
                component: componentTypes.TEXTAREA_FIELD,
                name: 'authentication.password',
                label: 'Token'
            }]
        }, {
            title: 'Enter OpenShift Container Platform information',
            fields: [{
                component: 'description',
                name: 'description-summary',
                content: <TextContent key='2'>
                    <Text component={ TextVariants.p }>
                    Provide OpenShift Container Platform URL and SSL certificate.
                    </Text>
                </TextContent>
            }, {
                component: componentTypes.TEXT_FIELD,
                name: 'url',
                label: 'URL',
                helperText: 'For example, https://myopenshiftcluster.mycompany.com',
                isRequired: true,
                validate: [{ type: 'required-validator' }]
            }, {
                component: componentTypes.CHECKBOX,
                name: 'endpoint.verify_ssl',
                label: 'Verify SSL'
            }, {
                component: componentTypes.TEXTAREA_FIELD,
                name: 'endpoint.certificate_authority',
                label: <SSLFormLabel />,
                condition: {
                    when: 'endpoint.verify_ssl',
                    is: true
                }
            }, {
                component: componentTypes.TEXT_FIELD,
                name: 'endpoint.role',
                type: 'hidden',
                initialValue: 'kubernetes' // value of 'role' for the endpoint
            }, {
                component: componentTypes.TEXT_FIELD,
                name: 'authentication.authtype',
                initialValue: 'token',
                type: 'hidden'
            }]
        }
    ],
    amazon: {
        title: 'Configure account access',
        fields: [{
            component: 'description',
            name: 'description-summary',
            content: <TextContent>
                <Text component={ TextVariants.p }>
                    <Title headingLevel="h3" size="2xl">Configure account access&nbsp;
                        <Popover
                            aria-label="Help text"
                            position="bottom"
                            bodyContent={
                                <React.Fragment>
                                    <Text component={ TextVariants.p }>
                            Red Had recommends using the Power User AWS
                                                Identity and Access Management (IAM) policy when adding an
                                                AWS account as a source. This Policy allows the user full
                                                access to API functionality and AWS services for user
                                                administration.
                                        <br />
                            Create an access key in the
                            &nbsp;<b>
                                Security Credentials
                                        </b>&nbsp;
                            area of your AWS user account. To add your
                                                account as a source, enter the access key ID and secret
                                                access key to act as your user ID and password.
                                    </Text>
                                </React.Fragment>
                            }
                            footerContent={ <a href='http://foo.bar'>
                    Learn more
                            </a> }
                        >
                            <QuestionCircleIcon />
                        </Popover>
                    </Title>
                </Text>
                <Text component={ TextVariants.p }>
                Create an access key in your AWS user account and enter the details below.
                </Text>
                <Text component={ TextVariants.p }>
                For sufficient access and security, Red Hat recommends using
                    the Power User IAM polocy for your AWS user account.
                </Text>
                <Text component={ TextVariants.p }>
                All fields are required.
                </Text>
            </TextContent>
        }, {
            component: componentTypes.TEXT_FIELD,
            name: 'authentication.username',
            label: 'Access Key ID',
            helperText: 'For example, AKIAIOSFODNN7EXAMPLE',
            isRequired: true,
            validate: [{ type: 'required-validator' }]
        }, {
            component: componentTypes.TEXT_FIELD,
            name: 'authentication.password',
            label: 'Secret Key',
            type: 'password',
            helperText: 'For example, wJairXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
            isRequired: true,
            validate: [{ type: 'required-validator' }]
        }, {
            component: componentTypes.TEXT_FIELD,
            name: 'endpoint.role',
            type: 'hidden',
            initialValue: 'aws' // value of 'role' for the endpoint
        }, {
            component: componentTypes.TEXT_FIELD,
            name: 'authentication.authtype',
            initialValue: 'access_key_secret_key',
            type: 'hidden'
        }]
    }
};

/* Switch between using hard-coded provider schemas and schemas from the api/source_types */
const sourceTypeSchemaHardcodedWithFallback = t => (
    temporaryHardcodedSourceSchemas[t.name] ||
    { ...t.schema, fields: t.schema.fields.sort((_a, b) => b.type === 'hidden' ? -1 : 0) }
);
const sourceTypeSchemaWithFallback = t => (t.schema || temporaryHardcodedSourceSchemas[t.name]);
const sourceTypeSchemaHardcoded = t => temporaryHardcodedSourceSchemas[t.name];
const sourceTypeSchemaServer = t => t.schema;

const schemaMode = 4; // defaults to 0

const sourceTypeSchema = {
    0: sourceTypeSchemaWithFallback,
    1: sourceTypeSchemaHardcoded,
    2: sourceTypeSchemaServer,
    4: sourceTypeSchemaHardcodedWithFallback
}[schemaMode];

const fieldsToStep = (fields, stepName, nextStep) => ({
    ...fields, // expected to include title and fields
    name: stepName,
    stepKey: stepName,
    nextStep
});

const indexedStepName = (base, index) => index === 0 ? base : `${base}_${index}`;

const fieldsToSteps = (fields, stepNamePrefix, lastStep) =>
    Array.isArray(fields) ?
        fields.map((page, index) =>
            fieldsToSteps(
                page,
                indexedStepName(stepNamePrefix, index),
                index < fields.length - 1 ? indexedStepName(stepNamePrefix, index + 1) : lastStep)
        ) : fieldsToStep(fields, stepNamePrefix, lastStep);

const sourceTypeSteps = sourceTypes =>
    sourceTypes.map(t => fieldsToSteps(sourceTypeSchema(t), t.name, 'application-type'))
    .flatMap((x) => x);

const summaryStep = (sourceTypes, applicationTypes) => ({
    fields: [
        {
            component: 'description',
            name: 'description-summary',
            content: <TextContent>
                <Title headingLevel="h3" size="2xl">Review source details</Title>
                <Text component={ TextVariants.p }>
            Review the information below and click Finish to configure your project. Use the Back button to make changes.
                </Text>
            </TextContent>
        },
        {
            name: 'summary',
            component: 'summary',
            sourceTypes,
            applicationTypes
        }],
    stepKey: 'summary',
    name: 'summary',
    title: 'Review source details'
});

const applicationStep = (applicationTypes) => ({
    stepKey: 'application-type',
    name: 'application-type',
    title: 'Select application',
    nextStep: 'summary',
    fields: [
        {
            component: 'card-select',
            name: 'application.application_type_id',
            label: 'Select your application',
            DefaultIcon: () => <React.Fragment />,
            options: compileAllApplicationComboOptions(applicationTypes)
        }
    ]
});

export default (sourceTypes, applicationTypes) => (
    { fields: [
        {
            component: componentTypes.WIZARD,
            name: 'wizard',
            title: 'Add a source',
            inModal: true,
            description: 'You are importing data into this platform',
            buttonLabels: {
                submit: 'Finish'
            },
            fields: [
                firstStepNew(sourceTypes),
                ...sourceTypeSteps(sourceTypes),
                applicationStep(applicationTypes),
                summaryStep(sourceTypes, applicationTypes)
            ]
        }
    ]});