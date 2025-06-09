"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, Calendar } from "lucide-react";

// In a real app, this would be fetched from contentlayer/MDX
const blogData = {
  "introduction-to-rag": {
    title: "Introduction to Retrieval-Augmented Generation (RAG)",
    description: "Learn the fundamentals of RAG systems and how they enhance LLM performance by providing factual, up-to-date information.",
    date: "2024-01-15",
    tags: ["rag", "llm", "ai engineering", "information retrieval"],
    image: "https://images.pexels.com/photos/1181271/pexels-photo-1181271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    readingTime: "8 min read",
    content: `
# Introduction to Retrieval-Augmented Generation (RAG)

Large language models (LLMs) have transformed how we interact with information, but they come with significant limitations: they can hallucinate, their knowledge is frozen at training time, and they lack access to proprietary or specific information. Retrieval-Augmented Generation (RAG) addresses these challenges by combining the powerful generation capabilities of LLMs with the ability to retrieve and reference external information.

## What is RAG?

Retrieval-Augmented Generation is an AI framework that enhances language models by enabling them to access and incorporate external knowledge. Rather than relying solely on their parametric knowledge (what's encoded in their weights), RAG systems retrieve relevant information from a knowledge base before generating a response.

The basic workflow of a RAG system involves:

1. **Query Processing**: Analyzing and understanding the user's query
2. **Retrieval**: Fetching relevant documents or information from a knowledge base
3. **Augmentation**: Enriching the prompt with retrieved information
4. **Generation**: Creating a response based on both the model's knowledge and the retrieved information

## Why RAG Matters

RAG systems offer several critical advantages:

- **Reduced Hallucinations**: By grounding responses in retrieved facts, RAG significantly reduces hallucinations
- **Knowledge Recency**: Access to up-to-date information bypasses the knowledge cutoff limitation
- **Domain Adaptation**: RAG enables LLMs to become experts in specific domains without fine-tuning
- **Transparency**: Citations can be provided to show the sources of information
- **Cost Efficiency**: Often more practical than fine-tuning or retraining models

## Core Components of RAG Systems

### 1. Document Processing Pipeline

Before retrieval can happen, documents must be processed:

\`\`\`python
from langchain.document_loaders import DirectoryLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter

# Load documents
loader = DirectoryLoader('./data/', glob="**/*.pdf")
documents = loader.load()

# Split into chunks
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200
)
chunks = text_splitter.split_documents(documents)
\`\`\`

### 2. Vector Database

Documents are embedded and stored in a vector database for semantic search:

\`\`\`python
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Chroma

# Create embeddings
embeddings = OpenAIEmbeddings()

# Create vector store
vectorstore = Chroma.from_documents(
    documents=chunks,
    embedding=embeddings,
)
\`\`\`

### 3. Retrieval

When a query comes in, semantically similar documents are retrieved:

\`\`\`python
# Simple retrieval
docs = vectorstore.similarity_search(query, k=3)

# Or with metadata filtering
docs = vectorstore.similarity_search(
    query,
    k=5,
    filter={"source": "annual_report_2023.pdf"}
)
\`\`\`

### 4. Augmentation and Generation

Retrieved documents are incorporated into the prompt for the LLM:

\`\`\`python
from langchain.chat_models import ChatOpenAI
from langchain.prompts import ChatPromptTemplate

prompt_template = """Answer the question based on the following context:

Context:
{context}

Question: {question}
"""

prompt = ChatPromptTemplate.from_template(prompt_template)
model = ChatOpenAI(model="gpt-4")

# Format prompt with retrieved documents
formatted_prompt = prompt.format(
    context="\\n\\n".join([doc.page_content for doc in docs]),
    question=query
)

# Generate response
response = model.predict(formatted_prompt)
\`\`\`

## Advanced RAG Techniques

While the basic RAG pattern is powerful, advanced techniques can significantly improve performance:

### 1. Hybrid Search

Combining semantic search with keyword-based methods:

\`\`\`python
from langchain.retrievers import BM25Retriever
from langchain.retrievers import EnsembleRetriever

# BM25 (lexical) retriever
bm25_retriever = BM25Retriever.from_documents(chunks)
bm25_retriever.k = 10

# Vector (semantic) retriever
vector_retriever = vectorstore.as_retriever(search_kwargs={"k": 10})

# Combine both retrievers
ensemble_retriever = EnsembleRetriever(
    retrievers=[bm25_retriever, vector_retriever],
    weights=[0.5, 0.5]
)

docs = ensemble_retriever.get_relevant_documents(query)
\`\`\`

### 2. Query Expansion

Expanding the user query to improve retrieval:

\`\`\`python
from langchain.retrievers import ContextualCompressionRetriever
from langchain.retrievers.document_compressors import LLMChainExtractor

# Create compressor for query expansion
compressor = LLMChainExtractor.from_llm(model)

# Create compression retriever
compression_retriever = ContextualCompressionRetriever(
    base_retriever=vectorstore.as_retriever(),
    document_compressor=compressor
)

expanded_docs = compression_retriever.get_relevant_documents(query)
\`\`\`

### 3. Re-ranking

Re-ranking retrieved documents based on relevance to the query:

\`\`\`python
from langchain.retrievers import ContextualCompressionRetriever
from langchain.retrievers.document_compressors import CohereRerank

# Initialize the re-ranker
compressor = CohereRerank()

# Create the retriever pipeline
retriever = ContextualCompressionRetriever(
    base_retriever=vectorstore.as_retriever(search_kwargs={"k": 20}),
    document_compressor=compressor
)

reranked_docs = retriever.get_relevant_documents(query)
\`\`\`

## Challenges and Best Practices

Building effective RAG systems involves addressing several challenges:

1. **Chunking Strategy**: Finding the optimal chunk size and overlap
2. **Embedding Selection**: Choosing the right embedding model for your domain
3. **Retrieval Tuning**: Balancing precision and recall in document retrieval
4. **Context Management**: Handling long contexts effectively
5. **Evaluation**: Creating robust metrics to measure RAG system performance

## Conclusion

RAG represents a paradigm shift in how we leverage LLMs, enabling more accurate, up-to-date, and specialized AI applications. By separating knowledge (retrieval) from reasoning (generation), RAG systems create more flexible and maintainable AI solutions.

In future articles, we'll explore advanced RAG patterns, evaluation frameworks, and techniques for specific domains like legal, medical, and financial applications.
    `
  },
  "yolov8-optimizations": {
    title: "Optimizing YOLOv8 for Edge Deployment",
    description: "Learn practical techniques to optimize YOLOv8 models for deployment on resource-constrained edge devices.",
    date: "2024-02-20",
    tags: ["computer vision", "yolo", "edge computing", "model optimization"],
    image: "https://images.pexels.com/photos/325153/pexels-photo-325153.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    readingTime: "12 min read",
    content: `
# Optimizing YOLOv8 for Edge Deployment

Computer vision at the edge is revolutionizing numerous industries, from manufacturing and retail to security and healthcare. YOLOv8, the latest iteration in the YOLO family, offers state-of-the-art performance for object detection tasks. However, deploying these powerful models on resource-constrained edge devices presents significant challenges.

In this article, I'll share practical techniques to optimize YOLOv8 models for edge deployment while maintaining acceptable accuracy.

## Understanding the Challenges

Edge devices typically have several constraints:

- Limited computational resources (CPU/GPU/NPU)
- Restricted memory capacity
- Power consumption limitations
- Thermal constraints
- Varying hardware architectures

YOLOv8, while efficient compared to many object detection models, still requires optimization to perform well under these constraints.

## Quantization: Trading Precision for Performance

Quantization reduces the precision of model weights, typically from 32-bit floating-point (FP32) to 8-bit integers (INT8) or even 4-bit integers (INT4). This significantly reduces model size and improves inference speed.

### Post-Training Quantization (PTQ)

PTQ is the simplest approach, applied after training:

\`\`\`python
import torch
from ultralytics import YOLO

# Load the model
model = YOLO('yolov8n.pt')

# Quantize the model
quantized_model = torch.quantization.quantize_dynamic(
    model,  # Model to quantize
    {torch.nn.Linear, torch.nn.Conv2d},  # Layers to quantize
    dtype=torch.qint8  # Quantization type
)

# Export the quantized model
torch.save(quantized_model.state_dict(), 'yolov8n_quantized.pt')
\`\`\`

### Quantization-Aware Training (QAT)

QAT simulates quantization during training, allowing the model to adapt:

\`\`\`python
from ultralytics import YOLO
import torch.quantization

# Load the model
model = YOLO('yolov8n.pt')

# Prepare for QAT
model.qconfig = torch.quantization.get_default_qat_qconfig('qnnpack')
torch.quantization.prepare_qat(model, inplace=True)

# Fine-tune with quantization awareness
model.train(
    data='coco.yaml',
    epochs=3,
    batch=16,
    imgsz=640
)

# Convert to quantized model
torch.quantization.convert(model, inplace=True)
model.save('yolov8n_qat.pt')
\`\`\`

## Pruning: Removing Unnecessary Connections

Pruning removes redundant parameters from the network:

\`\`\`python
import torch
from ultralytics import YOLO
import torch.nn.utils.prune as prune

# Load the model
model = YOLO('yolov8n.pt')

# Prune 30% of connections in all Conv2d layers
for name, module in model.named_modules():
    if isinstance(module, torch.nn.Conv2d):
        prune.l1_unstructured(module, name='weight', amount=0.3)

# Make pruning permanent
for name, module in model.named_modules():
    if isinstance(module, torch.nn.Conv2d):
        prune.remove(module, 'weight')

# Fine-tune the pruned model
model.train(
    data='coco.yaml',
    epochs=5,
    batch=16,
    imgsz=640
)

model.save('yolov8n_pruned.pt')
\`\`\`

## Knowledge Distillation: Learning from a Teacher

Knowledge distillation trains a smaller "student" model to mimic a larger "teacher" model:

\`\`\`python
from ultralytics import YOLO
import torch
import torch.nn.functional as F

# Load teacher model
teacher = YOLO('yolov8x.pt')  # Larger model
teacher.eval()

# Load student model
student = YOLO('yolov8n.pt')  # Smaller model

# Define distillation loss function
def distillation_loss(student_outputs, teacher_outputs, temperature=2.0):
    soft_targets = F.softmax(teacher_outputs / temperature, dim=1)
    student_log_softmax = F.log_softmax(student_outputs / temperature, dim=1)
    return F.kl_div(student_log_softmax, soft_targets, reduction='batchmean') * (temperature ** 2)

# Training loop with distillation (pseudocode)
for epoch in range(epochs):
    for images, targets in dataloader:
        # Get teacher predictions
        with torch.no_grad():
            teacher_preds = teacher(images)
        
        # Get student predictions
        student_preds = student(images)
        
        # Calculate standard task loss
        task_loss = student.loss_function(student_preds, targets)
        
        # Calculate distillation loss
        dist_loss = distillation_loss(student_preds, teacher_preds)
        
        # Combined loss
        total_loss = task_loss + alpha * dist_loss
        
        # Update student model
        total_loss.backward()
        optimizer.step()
\`\`\`

## Model Export and Optimization

Converting YOLOv8 to optimized formats significantly improves performance:

### ONNX Export

\`\`\`python
from ultralytics import YOLO

# Load the model
model = YOLO('yolov8n.pt')

# Export to ONNX
model.export(format='onnx', dynamic=True, simplify=True)
\`\`\`

### TensorRT Optimization

\`\`\`python
import tensorrt as trt
import numpy as np
import os

# Create a logger
logger = trt.Logger(trt.Logger.WARNING)

# Create a builder
builder = trt.Builder(logger)
network = builder.create_network(1 << int(trt.NetworkDefinitionCreationFlag.EXPLICIT_BATCH))
parser = trt.OnnxParser(network, logger)

# Parse ONNX file
with open('yolov8n.onnx', 'rb') as model:
    if not parser.parse(model.read()):
        for error in range(parser.num_errors):
            print(parser.get_error(error))

# Configure builder
config = builder.create_builder_config()
config.max_workspace_size = 1 << 30  # 1GB
config.set_flag(trt.BuilderFlag.FP16)

# Build engine
engine = builder.build_engine(network, config)

# Serialize engine
with open('yolov8n.engine', 'wb') as f:
    f.write(engine.serialize())
\`\`\`

## Platform-Specific Optimizations

Different edge platforms have specific optimizations:

### NVIDIA Jetson

\`\`\`python
# Use TensorRT as shown above
# Also utilize CUDA and cuDNN optimizations

# Example: Enable zero-copy memory
import pycuda.driver as cuda
import pycuda.autoinit

# Allocate zero-copy memory
host_mem = cuda.pagelocked_empty((size,), dtype=np.float32)
device_mem = cuda.mem_alloc(host_mem.nbytes)
\`\`\`

### ARM-based Devices

\`\`\`python
# Use ONNX Runtime with NNAPI (Android) or CoreML (iOS)
import onnxruntime as ort

# Create session with optimized execution provider
session = ort.InferenceSession(
    'yolov8n.onnx', 
    providers=['NNAPIExecutionProvider']  # Or 'CoreMLExecutionProvider'
)

# Run inference
outputs = session.run(None, {'images': input_tensor})
\`\`\`

## Measuring Performance Tradeoffs

It's essential to measure the impact of optimizations:

\`\`\`python
import time
import numpy as np
from ultralytics import YOLO

# Models to compare
models = {
    'original': YOLO('yolov8n.pt'),
    'quantized': YOLO('yolov8n_quantized.pt'),
    'pruned': YOLO('yolov8n_pruned.pt'),
    'distilled': YOLO('yolov8n_distilled.pt')
}

# Performance metrics
results = {}

# Run benchmarks
for name, model in models.items():
    # Accuracy
    val_results = model.val(data='coco.yaml')
    map50 = val_results.box.map50
    
    # Inference speed
    img = np.random.rand(1, 3, 640, 640)
    
    # Warmup
    for _ in range(10):
        _ = model(img)
    
    # Measure
    times = []
    for _ in range(100):
        start = time.time()
        _ = model(img)
        times.append(time.time() - start)
    
    avg_time = sum(times) / len(times)
    fps = 1 / avg_time
    
    # Model size
    size_mb = os.path.getsize(f'yolov8n_{name}.pt') / (1024 * 1024)
    
    results[name] = {
        'mAP@0.5': map50,
        'FPS': fps,
        'Size (MB)': size_mb
    }

# Print results
print(results)
\`\`\`

## Real-world Case Study

In a recent industrial inspection project, we deployed YOLOv8 on Jetson Nano devices to detect defects in manufacturing. By applying quantization, pruning, and TensorRT optimization:

- Model size reduced from 43MB to 11MB
- Inference speed improved from 7 FPS to 22 FPS
- Power consumption reduced by 60%
- mAP@0.5 decreased only from 89.2% to 87.8%

## Conclusion

Optimizing YOLOv8 for edge deployment involves balancing performance, accuracy, and resource constraints. By applying techniques like quantization, pruning, knowledge distillation, and platform-specific optimizations, you can achieve significant improvements in inference speed and memory usage with minimal accuracy loss.

Remember that the optimal approach depends on your specific use case, hardware constraints, and performance requirements. Always benchmark thoroughly and be prepared to try multiple optimization strategies to find the best solution for your edge deployment scenario.

In future articles, I'll explore hardware-specific optimizations and custom implementations for extreme edge cases. Stay tuned!
    `
  }
};

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState(blogData[slug as keyof typeof blogData]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch the post from an API or MDX file
    setPost(blogData[slug as keyof typeof blogData]);
    setIsLoading(false);
  }, [slug]);

  // Handle not found
  if (!post && !isLoading) {
    notFound();
  }

  // Format date
  const formattedDate = post ? new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : '';

  if (isLoading) {
    return (
      <div className="min-h-screen py-24">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="flex flex-col gap-8 animate-pulse max-w-4xl mx-auto">
            <div className="h-8 bg-muted rounded w-3/4 mx-auto" />
            <div className="h-96 bg-muted rounded" />
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-5/6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-24">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="flex flex-col gap-8 max-w-4xl mx-auto">
          <div className="flex items-center gap-2 justify-center md:justify-start">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/blog">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Blog
              </Link>
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-3xl font-bold sm:text-4xl md:text-5xl mb-6">
              {post.title}
            </h1>
            <div className="flex justify-center items-center gap-4 text-muted-foreground mb-8">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {formattedDate}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                {post.readingTime}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative aspect-[21/9] overflow-hidden rounded-xl mb-8 mx-auto w-full"
          >
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 1200px"
              priority
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap gap-2 mb-8 justify-center"
          >
            {post.tags.map((tag) => (
              <Link href={`/blog?tag=${tag}`} key={tag}>
                <Badge variant="secondary" className="hover:bg-secondary/80">
                  {tag}
                </Badge>
              </Link>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card className="p-6 lg:p-8">
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: convertMarkdownToHtml(post.content) }} />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-12"
          >
            <h2 className="text-2xl font-bold mb-6 text-center">Related Articles</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
              {Object.entries(blogData)
                .filter(([key]) => key !== slug)
                .slice(0, 3)
                .map(([key, relatedPost]) => (
                  <Card
                    key={key}
                    className="overflow-hidden group hover:shadow-md transition-all w-full max-w-sm"
                  >
                    <div className="aspect-video overflow-hidden">
                      <Image
                        src={relatedPost.image}
                        alt={relatedPost.title}
                        width={600}
                        height={400}
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold">{relatedPost.title}</h3>
                      <p className="text-muted-foreground text-sm line-clamp-2 mt-1">
                        {relatedPost.description}
                      </p>
                      <Link
                        href={`/blog/${key}`}
                        className="text-primary text-sm font-medium flex items-center mt-2 hover:underline"
                      >
                        Read Article <ArrowLeft className="ml-1 h-3 w-3 rotate-180" />
                      </Link>
                    </div>
                  </Card>
                ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Simple markdown to HTML converter (in a real app, use proper MDX rendering)
function convertMarkdownToHtml(markdown: string): string {
  // This is a very simplified converter for demo purposes
  let html = markdown;
  
  // Convert headings
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  
  // Convert paragraphs
  html = html.replace(/^(?!<h[1-6]|<pre|<ul|<ol|<li|<blockquote|<p|$)(.+)$/gm, '<p>$1</p>');
  
  // Convert code blocks
  html = html.replace(/```(.+?)```/gs, '<pre><code>$1</code></pre>');
  
  // Convert inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Convert bold
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  
  // Convert italics
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  
  // Convert lists
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.+<\/li>\n)+/g, '<ul>$&</ul>');
  
  // Convert numbered lists
  html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.+<\/li>\n)+/g, '<ol>$&</ol>');
  
  return html;
}