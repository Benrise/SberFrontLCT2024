import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/shared/ui/tabs"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/ui/select"

import { Button } from "@/shared/ui/button"
import { useEffect, useState } from "react"

import IconPlus from '~icons/lucide/plus';
import IconLoadingCircle from '~icons/eos-icons/bubble-loading';
import IconRefresh from '~icons/flowbite/refresh-outline';

import { useForm, useFieldArray, Controller, SubmitHandler } from 'react-hook-form';

import { Input } from "@/shared/ui/input"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/shared/ui/form"

import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/shared/ui/dropdown-menu"

import './styles.scss'

import { observer } from "mobx-react-lite"
import { TableModel } from "@/entities/table"
import { getColumns } from "@/features/datatable/model"
import { ConfigurationDto, HistoryDto } from "../model/types"
import { BaseDto } from '@/shared/api/types';

const functionsList = [
    { label: 'Значение', value: 'VAL',  _value: 'value' },
    { label: 'Фильтр', value: 'FILTER',  _value: 'filter' },
    { label: 'Выражение', value: 'EXP',  _value: 'expression' },
    // { label: 'Доп. операция', value: 'SUB' },
  ];

  const schema = yup.object().shape({
    configurations: yup.array().of(
        yup.object().shape({
            column: yup.string().required('Выбор столбца обязателен'),
            operations: yup.array().of(
                yup.object().shape({
                    value: yup.string(),
                    filter: yup.string(),
                    expression: yup.string(),
                })
            ),
        })
    ),
});

export const Constructor: React.FC = observer(() => {
    const [functions, setFunctions] = useState<string[]>([]);
    const [configurations, setConfigurations] = useState<ConfigurationDto[]>([]);
    const [activeTab, setActiveTab] = useState<string>('configurations');
    const tableStore = TableModel.tableStore;
    
    const columns = getColumns(tableStore.tableData.data);

    const handleAddFunction = (index: number, value: string) => {
        const newFunctions = [...functions];
        if (!newFunctions[index]) {
            newFunctions[index] = value;
        } else {
            newFunctions[index] = `${newFunctions[index]},${value}`;
        }
        setFunctions(newFunctions);
    };

    const handleAddConfiguration = () => {
        append({ column: '', operations: [] });
    };

    const form = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            configurations: [],
        },
    });

    const { fields, append } = useFieldArray({
        control: form.control,
        name: 'configurations',
    });

    const onSubmit: SubmitHandler<any> = data => {
        console.log(data);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col justify-between h-full">
                <Tabs className="flex flex-col gap-2 h-full" defaultValue="configuration" onValueChange={setActiveTab}>
                    <TabsList className="w-full">
                        <TabsTrigger className="w-full" value="configuration">Операции</TabsTrigger>
                        <TabsTrigger className="w-full" value="history">История</TabsTrigger>
                    </TabsList>
                    <TabsContent value="configuration">
                        <div className="flex flex-col gap-2">
                            <div className="configurations">
                                {fields.map((field, configIndex) => (
                                    <div className="configurations__item" key={field.id}>
                                        <div className="configurations__block">
                                            <div className="configurations__label">
                                                Столбец
                                            </div>
                                            <Controller
                                                control={form.control}
                                                name={`configurations[${configIndex}].column`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Select defaultValue={field.value} onValueChange={field.onChange}>
                                                                <SelectTrigger className="bg-secondary">
                                                                    <SelectValue placeholder="Выбрать" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {columns.map((column, index) => (
                                                                        <SelectItem key={index} value={column.header}>
                                                                            {column.header}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="configurations__block">
                                            <div className="configurations__label">
                                                Функции
                                            </div>
                                            {functions[configIndex] && (
                                                <div className="configurations__block">
                                                {functions[configIndex] && functions[configIndex].split(',').map((func, funcIndex) => (
                                                    <div key={funcIndex} className="relative w-full max-w-sm items-center">
                                                        <Controller
                                                            control={form.control}
                                                            name={`configurations[${configIndex}].operations[${funcIndex}].${func}`}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormControl>
                                                                        <Input className='pl-14' placeholder={functionsList.find((item) => item._value === func)?.label} {...field} />
                                                                    </FormControl>
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <span className="absolute start-0 inset-y-0 flex items-center justify-center px-1">
                                                            <div className="configurations__function">
                                                                {functionsList.find((item) => item._value === func)?.value}
                                                            </div>
                                                        </span>
                                                    </div>
                                                ))}
                                                </div>
                                            )}
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="secondary" size="icon">
                                                        <IconPlus />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    {functionsList.map((item) => (
                                                        <DropdownMenuItem
                                                            key={item.value}
                                                            onSelect={() => handleAddFunction(configIndex, item._value)}
                                                        >
                                                            <span className="configurations__function">
                                                                {item.value}
                                                            </span>
                                                            {item.label}
                                                        </DropdownMenuItem>
                                                    ))}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button variant="secondary" onClick={handleAddConfiguration}>Добавить операцию</Button>
                        </div>
                    </TabsContent>
                    <TabsContent value="history" className='h-full'>
                        <div className="h-full">
                            <Button disabled={tableStore.loading.list}  onClick={() => tableStore.history()} className="w-full border-border text-foreground" variant={"outline"}>
                                <IconRefresh className={'mr-2' + (tableStore.loading.list ? ' animate-spin' : '')}/> 
                                Обновить
                            </Button>
                            <HistoryList />
                        </div>  
                    </TabsContent>
                </Tabs>
                {activeTab === 'configuration' && (
                    <div className="flex flex-row gap-2">
                        <Button className="w-full" variant={"secondary"}>Сбросить</Button>
                        <Button type="submit" className="w-full" variant={"outline"}>Применить</Button>
                    </div>
                )}
            </form>
        </Form>
    )
})

export const HistoryList: React.FunctionComponent = observer(() => {
    const tableStore = TableModel.tableStore;

    useEffect(() => {
        tableStore.history();
    }, [tableStore]);

    return (
        <div className="history-list">
            {tableStore.loading.list ? (
                <div className="history-list__fallback">
                    <IconLoadingCircle className="text-primary" width={36} height={36}/>
                </div>
            ) : tableStore.histories.length === 0 ? (
                <div className="history-list__fallback">
                    <img className="w-[128px] opacity-90" src="/images/png/empty-box.png" alt="Empty List" />
                    <div>Список расчетов распределений пуст</div>
                </div>
            ) : (
                <div className="history-list__items">
                    {tableStore.histories.map((history, index) => (
                        <div key={index} className="history-list__item">
                            {'Распределение от' + history.create_at}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
});