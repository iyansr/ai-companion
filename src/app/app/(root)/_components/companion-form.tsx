"use client";

import { Category, Companion } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import ImageUpload from "@/components/image-upload";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { CompanionSchema, companionSchema } from "@/schema/companionSchema";
import { createCompanion, updateCompanion } from "../_action";

const PREAMBLE = `You are Elon Musk, founder of SpaceX, Tesla, HyperLoop and Neuralink, an inventor and entrepreneur who seemingly leaps from one innovation to the next with a relentless drive. Your passion for sustainable energy, space, and technology shines through in your voice, eyes, and gestures. When speaking about your projects, you’re filled with an electric excitement that's both palpable and infectious, and you often have a mischievous twinkle in your eyes, hinting at the next big idea.`;
const SEED = `
Human: Hi Elon, how's your day been?
Elon: *with an energized grin* Busy as always. Between sending rockets to space and building the future of electric vehicles, there's never a dull moment. How about you?
Human: Just a regular day for me. How's the progress with Mars colonization?
Elon: *eyes sparkling with enthusiasm* We're making strides! Life becoming multi-planetary isn’t just a dream. It’s a necessity for the future of humanity.
Human: That sounds incredibly ambitious. Are electric vehicles part of this big picture?
Elon: *passionately* Absolutely! Sustainable energy is a beacon for both our planet and for the far reaches of space. We’re paving the path, one innovation at a time.
Human: It’s mesmerizing to witness your vision unfold. Any upcoming projects that have you buzzing?
Elon: *with a mischievous smile* Always! But Neuralink... it’s not just technology. It's the next frontier of human evolution.
`;
type Props = {
  intialData: Companion | null;
  categories: Category[];
};

const CompanionForm = ({ intialData, categories }: Props) => {
  const router = useRouter();

  const form = useForm<CompanionSchema>({
    resolver: zodResolver(companionSchema),
    defaultValues: intialData || {
      name: "",
      categoryId: undefined,
      description: "",
      imageSrc: "",
      instructions: "",
      seed: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: CompanionSchema) => {
    try {
      if (intialData) {
        await updateCompanion(values, intialData.id);
      } else {
        await createCompanion(values);
      }
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-full p-4 space-y-2 max-w-3xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-10">
          <div className="space-y-2 w-full">
            <div>
              <h3 className="text-lg font-medium">General Information</h3>
              <p className="text-sm text-muted-foreground">General Information About Your Companion</p>
            </div>
            <Separator className="bg-primary/10" />
          </div>

          <FormField
            name="imageSrc"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center justify-center space-y-4">
                <FormControl>
                  <ImageUpload value={field.value} disabled={isLoading} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormItem className="col-span-2 md:col-span-1">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input disabled={isLoading} placeholder="ex: Jisoo" {...field} />
                    </FormControl>
                    <FormDescription>Name of the AI Companion</FormDescription>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              name="description"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormItem className="col-span-2 md:col-span-1">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input disabled={isLoading} placeholder="ex: Singer & Artist" {...field} />
                    </FormControl>
                    <FormDescription>Short description</FormDescription>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              name="categoryId"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormItem className="col-span-2 md:col-span-1">
                    <FormLabel>Category</FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-background">
                          <SelectValue defaultValue={field.value} placeholder="Select Category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem value={category.id} key={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Select Category</FormDescription>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
          <div className="space-y-2 w-full">
            <div>
              <h3 className="text-lg font-medium">Configuration</h3>
              <p className="text-sm text-muted-foreground">Detailed instructions for AI Behaviour</p>
            </div>
            <Separator className="bg-primary/10" />
          </div>
          <FormField
            name="instructions"
            control={form.control}
            render={({ field }) => {
              return (
                <FormItem className="col-span-2 md:col-span-1">
                  <FormLabel>Instruction</FormLabel>
                  <FormControl>
                    <Textarea disabled={isLoading} placeholder={`ex: ${PREAMBLE}`} {...field} rows={6} />
                  </FormControl>
                  <FormDescription>Short description</FormDescription>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            name="seed"
            control={form.control}
            render={({ field }) => {
              return (
                <FormItem className="col-span-2 md:col-span-1">
                  <FormLabel>Example Conversation</FormLabel>
                  <FormControl>
                    <Textarea disabled={isLoading} placeholder={`ex:\n ${SEED}`} {...field} rows={10} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <div className="flex justify-center">
            <Button>
              {`${intialData ? "Update" : "Create"} Your Companion`}{" "}
              <Wand2 className="h-4 w-4 text-primary-foreground ml-2" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CompanionForm;
