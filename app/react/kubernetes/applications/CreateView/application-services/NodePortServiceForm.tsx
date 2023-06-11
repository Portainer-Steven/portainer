import { FormikErrors } from 'formik';
import { ChangeEvent } from 'react';
import { Plus, Trash2 } from 'lucide-react';

import { FormError } from '@@/form-components/FormError';
import { ButtonSelector } from '@@/form-components/ButtonSelector/ButtonSelector';
import { Button } from '@@/buttons';
import { Widget } from '@@/Widget';
import { Card } from '@@/Card';
import { InputGroup } from '@@/form-components/InputGroup';

import { isServicePortError, newPort } from './utils';
import { ContainerPortInput } from './ContainerPortInput';
import { ServicePortInput } from './ServicePortInput';
import { ServiceFormValues, ServicePort } from './types';

interface Props {
  services: ServiceFormValues[];
  serviceIndex: number;
  onChangeService: (services: ServiceFormValues[]) => void;
  servicePorts: ServicePort[];
  onChangePort: (servicePorts: ServicePort[]) => void;
  serviceName?: string;
  errors?: string | string[] | FormikErrors<ServicePort>[];
}

export function NodePortServiceForm({
  services,
  serviceIndex,
  onChangeService,
  servicePorts,
  onChangePort,
  errors,
  serviceName,
}: Props) {
  const newNodePortPort = newPort(serviceName);
  return (
    <Widget key={serviceIndex}>
      <Widget.Body>
        <div className="mb-4 flex justify-between">
          <div className="text-muted vertical-center">NodePort service</div>
          <Button
            icon={Trash2}
            color="dangerlight"
            className="!ml-0"
            onClick={() => {
              // remove the service at index in an immutable way
              const newServices = [
                ...services.slice(0, serviceIndex),
                ...services.slice(serviceIndex + 1),
              ];
              onChangeService(newServices);
            }}
          >
            Remove service
          </Button>
        </div>
        <div className="control-label !mb-2 !pt-0 text-left">Ports</div>
        <div className="flex flex-col gap-3">
          {servicePorts.map((servicePort, portIndex) => {
            const error = errors?.[portIndex];
            const servicePortError = isServicePortError<ServicePort>(error)
              ? error
              : undefined;

            return (
              <Card
                key={portIndex}
                className="flex flex-grow flex-wrap justify-between gap-x-4 gap-y-1"
              >
                <div className="inline-flex min-w-min flex-grow basis-3/4 flex-wrap gap-2">
                  <div className="flex min-w-min basis-1/4 flex-col">
                    <ContainerPortInput
                      index={portIndex}
                      value={servicePort.targetPort}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        const newServicePorts = [...servicePorts];
                        const newValue =
                          e.target.value === ''
                            ? undefined
                            : Number(e.target.value);
                        newServicePorts[portIndex] = {
                          ...newServicePorts[portIndex],
                          targetPort: newValue,
                          port: newValue,
                        };
                        onChangePort(newServicePorts);
                      }}
                    />
                    {servicePortError?.targetPort && (
                      <FormError>{servicePortError.targetPort}</FormError>
                    )}
                  </div>

                  <div className="flex min-w-min basis-1/4 flex-col">
                    <ServicePortInput
                      index={portIndex}
                      value={servicePort.port}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        const newServicePorts = [...servicePorts];
                        newServicePorts[portIndex] = {
                          ...newServicePorts[portIndex],
                          port:
                            e.target.value === ''
                              ? undefined
                              : Number(e.target.value),
                        };
                        onChangePort(newServicePorts);
                      }}
                    />
                    {servicePortError?.port && (
                      <FormError>{servicePortError.port}</FormError>
                    )}
                  </div>
                  <div className="flex min-w-min basis-1/4 flex-col">
                    <InputGroup size="small">
                      <InputGroup.Addon>Nodeport</InputGroup.Addon>
                      <InputGroup.Input
                        type="number"
                        className="form-control min-w-max"
                        name={`node_port_${portIndex}`}
                        placeholder="30080"
                        min="30000"
                        max="32767"
                        value={servicePort.nodePort ?? ''}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          const newServicePorts = [...servicePorts];
                          newServicePorts[portIndex] = {
                            ...newServicePorts[portIndex],
                            nodePort:
                              e.target.value === ''
                                ? undefined
                                : Number(e.target.value),
                          };
                          onChangePort(newServicePorts);
                        }}
                        data-cy={`k8sAppCreate-nodePort_${portIndex}`}
                      />
                    </InputGroup>
                    {servicePortError?.nodePort && (
                      <FormError>{servicePortError.nodePort}</FormError>
                    )}
                  </div>
                  <ButtonSelector
                    className="h-[30px]"
                    onChange={(value) => {
                      const newServicePorts = [...servicePorts];
                      newServicePorts[portIndex] = {
                        ...newServicePorts[portIndex],
                        protocol: value,
                      };
                      onChangePort(newServicePorts);
                    }}
                    value={servicePort.protocol || 'TCP'}
                    options={[{ value: 'TCP' }, { value: 'UDP' }]}
                  />
                </div>
                <Button
                  disabled={servicePorts.length === 1}
                  size="small"
                  className="!ml-0 h-[30px]"
                  color="dangerlight"
                  type="button"
                  onClick={() => {
                    // remove the port at the index in an immutable way
                    const newServicePorts = [
                      ...servicePorts.slice(0, portIndex),
                      ...servicePorts.slice(portIndex + 1),
                    ];
                    onChangePort(newServicePorts);
                  }}
                  data-cy={`k8sAppCreate-rmPortButton_${portIndex}`}
                  icon={Trash2}
                >
                  Remove port
                </Button>
              </Card>
            );
          })}
          <div className="flex">
            <Button
              icon={Plus}
              color="default"
              className="!ml-0"
              onClick={() => {
                const newServicesPorts = [...servicePorts, newNodePortPort];
                onChangePort(newServicesPorts);
              }}
            >
              Add port
            </Button>
          </div>
        </div>
      </Widget.Body>
    </Widget>
  );
}
